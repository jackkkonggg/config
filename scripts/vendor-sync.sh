#!/bin/bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MANIFEST="$REPO_DIR/skills/.vendor-manifest.json"
VENDOR_STATE_DIR="$REPO_DIR/.vendor-state"
PRISTINE_ROOT="$VENDOR_STATE_DIR/pristine"
PATCH_ROOT="$VENDOR_STATE_DIR/patches"
source "$(dirname "$0")/lib.sh"

if [ ! -f "$MANIFEST" ]; then
  echo "No .vendor-manifest.json found. Nothing to sync."
  exit 0
fi

UPDATED=0
MERGED=0
FAILED=0

# Ensure temp dirs are cleaned up on exit
TEMP_DIR=""
cleanup() { [ -n "${TEMP_DIR:-}" ] && rm -rf "$TEMP_DIR" || true; }
trap cleanup EXIT

echo "==> Syncing vendor skills"
mkdir -p "$PRISTINE_ROOT" "$PATCH_ROOT"

while IFS= read -r skill; do
  VENDOR_PATH=$(manifest_get "$MANIFEST" "$skill" "vendor_path")
  STORED_HASH=$(manifest_get "$MANIFEST" "$skill" "hash")
  FILE_MAP=$(manifest_get "$MANIFEST" "$skill" "file_map")

  VENDOR_FULL="$REPO_DIR/$VENDOR_PATH"
  SKILL_DIR="$REPO_DIR/skills/$skill"
  PRISTINE_DIR="$PRISTINE_ROOT/$skill"

  if [ ! -d "$VENDOR_FULL" ] && [ ! -f "$VENDOR_FULL" ]; then
    echo "  WARN: vendor path missing for $skill: $VENDOR_PATH"
    continue
  fi
  if [ ! -d "$PRISTINE_DIR" ]; then
    echo "  WARN: no pristine vendor state for $skill, skipping"
    continue
  fi

  # Step 1: Generate vendor.patch for documentation
  PATCH_FILE="$PATCH_ROOT/$skill.patch"
  TEMP_DIR=$(mktemp -d)
  rsync -a "$SKILL_DIR/" "$TEMP_DIR/current/"
  cp -R "$PRISTINE_DIR/" "$TEMP_DIR/pristine/"
  DIFF_OUTPUT=$(cd "$TEMP_DIR" && git diff --no-index pristine/ current/ 2>/dev/null || true)

  if [ -n "$DIFF_OUTPUT" ]; then
    echo "$DIFF_OUTPUT" > "$PATCH_FILE"
    HAS_MODIFICATIONS=true
  else
    rm -f "$PATCH_FILE"
    HAS_MODIFICATIONS=false
  fi

  # Step 2: Check if vendor changed
  CURRENT_HASH=$(compute_hash "$VENDOR_FULL")
  if [ "$CURRENT_HASH" = "$STORED_HASH" ]; then
    rm -rf "$TEMP_DIR"; TEMP_DIR=""
    if [ "$HAS_MODIFICATIONS" = true ]; then
      echo "  $skill: local modifications (vendor unchanged)"
    fi
    continue
  fi

  echo "  $skill: vendor updated"
  UPDATED=$((UPDATED + 1))

  # Step 3: Three-way merge
  # Save old pristine as merge base
  OLD_PRISTINE="$TEMP_DIR/old_pristine"
  cp -R "$PRISTINE_DIR/" "$OLD_PRISTINE/"

    # Prepare new pristine in temp (don't update vendor state until merge succeeds)
  NEW_PRISTINE="$TEMP_DIR/new_pristine"
  copy_vendor "$VENDOR_FULL" "$NEW_PRISTINE" "$FILE_MAP"

  if [ "$HAS_MODIFICATIONS" = false ]; then
    # No local modifications — just copy new vendor to skill dir and pristine
    copy_vendor "$VENDOR_FULL" "$SKILL_DIR" "$FILE_MAP"
    rm -rf "$PRISTINE_DIR"
    mv "$NEW_PRISTINE" "$PRISTINE_DIR"
    echo "    Updated (no local modifications to preserve)"
  else
    # Three-way merge per file using git merge-file
    MERGE_OK=true

    while IFS= read -r -d '' file; do
      rel="${file#"$NEW_PRISTINE"/}"
      local_file="$SKILL_DIR/$rel"
      old_base="$OLD_PRISTINE/$rel"
      new_vendor="$NEW_PRISTINE/$rel"

      if [ ! -f "$local_file" ]; then
        # New vendor file — copy it
        mkdir -p "$(dirname "$local_file")"
        cp "$new_vendor" "$local_file"
      elif [ ! -f "$old_base" ]; then
        # File only in new vendor (didn't exist before) — copy it
        mkdir -p "$(dirname "$local_file")"
        cp "$new_vendor" "$local_file"
      elif diff -q "$local_file" "$old_base" > /dev/null 2>&1; then
        # File not modified locally — just take new vendor version
        cp "$new_vendor" "$local_file"
      else
        # File modified locally — three-way merge
        merge_exit=0
        git merge-file -p "$local_file" "$old_base" "$new_vendor" > "$local_file.merged" 2>/dev/null || merge_exit=$?
        if [ "$merge_exit" -eq 0 ]; then
          mv "$local_file.merged" "$local_file"
        elif [ "$merge_exit" -eq 1 ]; then
          # Conflicts but content preserved with markers
          mv "$local_file.merged" "$local_file"
          echo "    CONFLICT in $rel — resolve manually"
          MERGE_OK=false
        else
          # Real error
          echo "    ERROR merging $rel (exit $merge_exit)"
          rm -f "$local_file.merged"
          MERGE_OK=false
        fi
      fi
    done < <(find "$NEW_PRISTINE" -type f -print0)

    # Handle files in old pristine but not in new (vendor removed them)
    while IFS= read -r -d '' file; do
      rel="${file#"$OLD_PRISTINE"/}"
      if [ ! -f "$NEW_PRISTINE/$rel" ] && [ -f "$SKILL_DIR/$rel" ]; then
        if diff -q "$SKILL_DIR/$rel" "$file" > /dev/null 2>&1; then
          rm "$SKILL_DIR/$rel"
          echo "    Removed $rel (vendor deleted, no local modifications)"
        else
          echo "    KEPT $rel (vendor deleted but has local modifications)"
        fi
      fi
    done < <(find "$OLD_PRISTINE" -type f -print0)

    # Update pristine vendor state only after successful merge
    rm -rf "$PRISTINE_DIR"
    mv "$NEW_PRISTINE" "$PRISTINE_DIR"

    if [ "$MERGE_OK" = true ]; then
      echo "    Merged successfully"
      MERGED=$((MERGED + 1))
    else
      FAILED=$((FAILED + 1))
    fi
  fi

  rm -rf "$TEMP_DIR"; TEMP_DIR=""

  # Update manifest hash
  manifest_set_hash "$MANIFEST" "$skill" "$CURRENT_HASH"
done < <(manifest_list "$MANIFEST")

echo ""
echo "Sync complete: $UPDATED updated, $MERGED merged, $FAILED failed"
