import os
import sys

base_dir = r"D:\sir2026"
if not os.path.exists(base_dir):
    print(f"Directory {base_dir} does not exist.")
    sys.exit(1)

entries = sorted([d for d in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, d)) and d.startswith("ac_")])

print(f"Total AC folders found in {base_dir}: {len(entries)}")

stats = []
for folder in entries:
    full_path = os.path.join(base_dir, folder)
    files = [f for f in os.listdir(full_path) if f.endswith(".pdf")]
    total_bytes = sum(os.path.getsize(os.path.join(full_path, f)) for f in files)
    gb = total_bytes / (1024**3)
    mb = total_bytes / (1024**2)

    # Check for tiny files (< 100 KB)
    tiny_files = [f for f in files if os.path.getsize(os.path.join(full_path, f)) < 102400]

    parts = folder.split("_")
    ac_num = int(parts[1]) if len(parts) > 1 and parts[1].isdigit() else -1

    stats.append({
        "folder": folder,
        "ac_no": ac_num,
        "pdf_count": len(files),
        "bytes": total_bytes,
        "gb": round(gb, 3),
        "mb": round(mb, 1),
        "tiny_count": len(tiny_files),
    })

# Identify abnormally small folders
# Normal AP AC has ~200 - 350 booths and ~2.0 - 3.5 GB
critically_low = [s for s in stats if s["pdf_count"] < 50]
very_low = [s for s in stats if 50 <= s["pdf_count"] < 150]
moderately_low = [s for s in stats if 150 <= s["pdf_count"] < 185]
normal_count = [s for s in stats if s["pdf_count"] >= 185]

print("\n" + "=" * 88)
print(f"{'AC':<5} | {'Folder Name':<28} | {'Booths':<7} | {'Size':<10} | {'Status'}")
print("=" * 88)

# 1. Critically Low
if critically_low:
    print("\n--- 🚨 CRITICALLY TRUNCATED (< 50 Booths) ---")
    for s in sorted(critically_low, key=lambda x: x["ac_no"]):
        sz = f"{s['gb']:.2f} GB" if s['gb'] >= 1.0 else f"{s['mb']:.1f} MB"
        print(f"AC {s['ac_no']:<3} | {s['folder']:<28} | {s['pdf_count']:<7} | {sz:<10} | CRITICALLY LOW")

# 2. Very Low
if very_low:
    print("\n--- ⚠️ HEAVILY TRUNCATED (50 to 149 Booths) ---")
    for s in sorted(very_low, key=lambda x: x["ac_no"]):
        sz = f"{s['gb']:.2f} GB" if s['gb'] >= 1.0 else f"{s['mb']:.1f} MB"
        print(f"AC {s['ac_no']:<3} | {s['folder']:<28} | {s['pdf_count']:<7} | {sz:<10} | HEAVILY TRUNCATED")

# 3. Moderately Low (150 to 184 booths)
if moderately_low:
    print("\n--- ℹ️ SLIGHTLY LOW / SMALLER CONSTITUENCIES (150 to 184 Booths) ---")
    for s in sorted(moderately_low, key=lambda x: x["ac_no"]):
        sz = f"{s['gb']:.2f} GB" if s['gb'] >= 1.0 else f"{s['mb']:.1f} MB"
        print(f"AC {s['ac_no']:<3} | {s['folder']:<28} | {s['pdf_count']:<7} | {sz:<10} | REVIEW CEILING")

print("\n" + "=" * 88)
print(f"SUMMARY OF SCANNED FOLDERS:")
print(f"  • Total AC Folders on D:\\sir2026 : {len(stats)} ACs")
print(f"  • Normal (>= 185 booths)         : {len(normal_count)} ACs")
print(f"  • Slightly Low (150 - 184 booths): {len(moderately_low)} ACs")
print(f"  • Heavily Truncated (50 - 149)   : {len(very_low)} ACs")
print(f"  • Critically Low (< 50 booths)   : {len(critically_low)} ACs")
total_state_gb = sum(s['gb'] for s in stats)
print(f"  • Total Downloaded Data on Disk  : {total_state_gb:.2f} GB")
print("=" * 88)
