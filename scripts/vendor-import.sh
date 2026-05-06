#!/bin/bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MANIFEST="$REPO_DIR/skills/.vendor-manifest.json"
VENDOR_STATE_DIR="$REPO_DIR/.vendor-state"
PRISTINE_ROOT="$VENDOR_STATE_DIR/pristine"
source "$(dirname "$0")/lib.sh"

usage() {
  echo "Usage: $0 <vendor-path> <skill-name> [--file-map 'src:dst,src2:dst2']"
  echo ""
  echo "Import a vendor skill into skills/ with pristine tracking."
  echo ""
  echo "  vendor-path  Relative path to vendor source (directory or file)"
  echo "  skill-name   Name for the skill in skills/"
  echo "  --file-map   Optional file rename mappings (comma-separated src:dst pairs)"
  exit 1
}

VENDOR_PATH=""
SKILL_NAME=""
FILE_MAP=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --file-map) FILE_MAP="$2"; shift 2 ;;
    -h|--help) usage ;;
    *)
      if [ -z "$VENDOR_PATH" ]; then VENDOR_PATH="$1"
      elif [ -z "$SKILL_NAME" ]; then SKILL_NAME="$1"
      else usage; fi
      shift ;;
  esac
done

if [ -z "$VENDOR_PATH" ] || [ -z "$SKILL_NAME" ]; then
  usage
fi

# Validate file_map format
if [ -n "$FILE_MAP" ]; then
  IFS=',' read -ra MAPS <<< "$FILE_MAP"
  for map in "${MAPS[@]}"; do
    if [[ "$map" != *:* ]]; then
      echo "Error: invalid file-map entry '$map' (expected src:dst format)"
      exit 1
    fi
  done
fi

VENDOR_FULL="$REPO_DIR/$VENDOR_PATH"
SKILL_DIR="$REPO_DIR/skills/$SKILL_NAME"
PRISTINE_DIR="$PRISTINE_ROOT/$SKILL_NAME"

if [ ! -d "$VENDOR_FULL" ] && [ ! -f "$VENDOR_FULL" ]; then
  echo "Error: vendor path not found: $VENDOR_FULL"
  exit 1
fi

if [ -d "$PRISTINE_DIR" ]; then
  echo "Error: $SKILL_NAME already has pristine vendor state — use vendor-sync.sh to update"
  exit 1
fi

RETROACTIVE=false
if [ -d "$SKILL_DIR" ] && [ -f "$SKILL_DIR/SKILL.md" ]; then
  RETROACTIVE=true
  echo "Importing $SKILL_NAME (retroactive — skill already exists)"
else
  echo "Importing $SKILL_NAME from $VENDOR_PATH"
fi

mkdir -p "$PRISTINE_ROOT"

# Create pristine state from vendor
copy_vendor "$VENDOR_FULL" "$PRISTINE_DIR" "$FILE_MAP"

# Copy to skill dir only if fresh import
if [ "$RETROACTIVE" = false ]; then
  copy_vendor "$VENDOR_FULL" "$SKILL_DIR" "$FILE_MAP"
fi

HASH=$(compute_hash "$VENDOR_FULL")

# Update manifest
[ ! -f "$MANIFEST" ] && echo '{}' > "$MANIFEST"
manifest_add "$MANIFEST" "$SKILL_NAME" "$VENDOR_PATH" "$HASH" "$FILE_MAP"

if [ "$RETROACTIVE" = true ]; then
  echo "  Created pristine vendor state from source"
  echo "  Run vendor-sync.sh to generate .vendor-state/patches/$SKILL_NAME.patch"
else
  echo "  Copied to skills/$SKILL_NAME/"
  echo "  Created pristine vendor state"
fi
echo "  Hash: $HASH"
