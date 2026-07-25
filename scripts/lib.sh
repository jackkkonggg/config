#!/bin/bash
# Shared functions for vendor skill management

compute_hash() {
  if [ -d "$1" ]; then
    (cd "$1" && find . -type f ! -path './.git/*' ! -name '*.tmpl' -print0 \
      | sort -z \
      | xargs -0 shasum -a 256 \
      | shasum -a 256 \
      | awk '{print $1}')
  else
    shasum -a 256 "$1" | awk '{print $1}'
  fi
}

apply_renames() {
  local dir="$1" file_map="$2"
  if [ -n "$file_map" ]; then
    IFS=',' read -ra MAPS <<< "$file_map"
    for map in "${MAPS[@]}"; do
      local src="${map%%:*}" dst="${map##*:}"
      [ -f "$dir/$src" ] && mv "$dir/$src" "$dir/$dst"
    done
  fi
}

copy_vendor() {
  local vendor_path="$1" target="$2" file_map="$3"
  mkdir -p "$target"
  if [ -d "$vendor_path" ]; then
    rsync -a --exclude='*.tmpl' --exclude='.git' --exclude='__pycache__' "$vendor_path/" "$target/"
  else
    cp "$vendor_path" "$target/"
  fi
  apply_renames "$target" "$file_map"
}

# Read a single field from the vendor manifest
# Usage: manifest_get <manifest_path> <skill_name> <field>
manifest_get() {
  python3 - "$1" "$2" "$3" <<'PYEOF'
import json, sys
with open(sys.argv[1]) as f:
    e = json.load(f)[sys.argv[2]]
field = sys.argv[3]
if field == "file_map":
    fm = e.get('file_map', {})
    print(','.join(f"{k}:{v}" for k, v in fm.items()))
else:
    print(e.get(field, ''))
PYEOF
}

# Update a hash in the manifest
# Usage: manifest_set_hash <manifest_path> <skill_name> <hash>
manifest_set_hash() {
  python3 - "$1" "$2" "$3" "${4:-}" <<'PYEOF'
import json, sys
manifest_path, skill_name, new_hash = sys.argv[1], sys.argv[2], sys.argv[3]
revision = sys.argv[4] if len(sys.argv) > 4 else ''
with open(manifest_path, 'r') as f:
    manifest = json.load(f)
manifest[skill_name]['hash'] = new_hash
if revision:
    manifest[skill_name]['revision'] = revision
with open(manifest_path, 'w') as f:
    json.dump(manifest, f, indent=2, sort_keys=True)
    f.write('\n')
PYEOF
}

# Add a skill entry to the manifest
# Usage: manifest_add <manifest_path> <skill_name> <vendor_path> <hash> [file_map]
manifest_add() {
  python3 - "$1" "$2" "$3" "$4" "${5:-}" "${6:-}" <<'PYEOF'
import json, sys
manifest_path = sys.argv[1]
skill_name = sys.argv[2]
vendor_path = sys.argv[3]
hash_val = sys.argv[4]
file_map_str = sys.argv[5] if len(sys.argv) > 5 else ''
revision = sys.argv[6] if len(sys.argv) > 6 else ''

with open(manifest_path, 'r') as f:
    manifest = json.load(f)

entry = {'vendor_path': vendor_path, 'hash': hash_val}
if revision:
    entry['revision'] = revision
if file_map_str:
    entry['file_map'] = dict(p.split(':') for p in file_map_str.split(','))

manifest[skill_name] = entry

with open(manifest_path, 'w') as f:
    json.dump(manifest, f, indent=2, sort_keys=True)
    f.write('\n')
PYEOF
}

vendor_root_for_path() {
  local repo_dir="$1" vendor_path="$2"
  git -C "$repo_dir" config -f .gitmodules --get-regexp '\.path$' |
    awk -v target="$vendor_path" '
      {
        candidate = $2
        if (target == candidate || index(target, candidate "/") == 1) {
          if (length(candidate) > length(best)) best = candidate
        }
      }
      END { print best }
    '
}

vendor_revision_for_path() {
  local repo_dir="$1" vendor_path="$2" vendor_root
  vendor_root="$(vendor_root_for_path "$repo_dir" "$vendor_path")"
  [ -n "$vendor_root" ] || return 0
  git -C "$repo_dir/$vendor_root" rev-parse HEAD 2>/dev/null || true
}

# List all skills in the manifest
# Usage: manifest_list <manifest_path>
manifest_list() {
  python3 - "$1" <<'PYEOF'
import json, sys
with open(sys.argv[1]) as f:
    for name in sorted(json.load(f)):
        print(name)
PYEOF
}
