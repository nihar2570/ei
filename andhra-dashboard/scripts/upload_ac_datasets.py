"""
Automated Kaggle Dataset Uploader for Andhra ACs (AC 3 to AC 11)
---------------------------------------------------------------
Iterates through AC 3 to AC 11 in D:\\apdata\\sir2026\\:
1. Verifies dataset-metadata.json exists.
2. Checks if the dataset already exists and is 'ready' on Kaggle.
3. If not ready, executes `kaggle datasets create -p <folder>`.
4. Polls until dataset status transitions to 'ready'.
5. Updates a persistent upload_progress.json file with timestamps and status.
"""

import datetime
import json
import os
import subprocess
import sys
import time

BASE_DIR = r"D:\apdata\sir2026"
PROGRESS_FILE = os.path.join(os.path.dirname(__file__), "upload_progress.json")

ACS_TO_UPLOAD = [
    (3, "ac_003_tekkali"),
    (4, "ac_004_pathapatnam"),
    (5, "ac_005_srikakulam"),
    (6, "ac_006_amadalavalasa"),
    (7, "ac_007_etcherla"),
    (8, "ac_008_narasannapeta"),
    (9, "ac_009_rajam"),
    (10, "ac_010_palakonda"),
    (11, "ac_011_kurupam"),
]


def load_progress():
    if os.path.exists(PROGRESS_FILE):
        try:
            with open(PROGRESS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {"updated_at": None, "datasets": {}}


def save_progress(progress):
    progress["updated_at"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
        json.dump(progress, f, indent=2)


def run_cmd(cmd_list):
    res = subprocess.run(cmd_list, capture_output=True, text=True, check=False)
    return res.returncode, res.stdout.strip(), res.stderr.strip()


def get_dataset_status(dataset_ref):
    code, out, _ = run_cmd([sys.executable, "-m", "kaggle", "datasets", "status", dataset_ref])
    if code == 0:
        return out.strip().lower()
    return None


def wait_for_dataset_ready(dataset_ref, timeout_sec=600):
    print(f"[{dataset_ref}] Waiting for Kaggle to process dataset (timeout: {timeout_sec}s)...", flush=True)
    start = time.time()
    while time.time() - start < timeout_sec:
        status = get_dataset_status(dataset_ref)
        print(f"[{dataset_ref}] Current status: {status}", flush=True)
        if status == "ready":
            return True
        if status and "error" in status:
            return False
        time.sleep(15)
    return False


def upload_ac(ac_num, dir_name, progress):
    folder_path = os.path.join(BASE_DIR, dir_name)
    slug = f"ac{ac_num}-sir2026-pdfs"
    ref = f"nid2570/{slug}"

    print(f"\n{'='*70}", flush=True)
    print(f"Processing AC {ac_num}: {slug} ({folder_path})", flush=True)
    print(f"{'='*70}", flush=True)

    if not os.path.isdir(folder_path):
        print(f"ERROR: Folder {folder_path} does not exist! Skipping.", flush=True)
        return False

    # Check status on Kaggle first
    current_status = get_dataset_status(ref)
    if current_status == "ready":
        print(f"[AC {ac_num}] Dataset {ref} is ALREADY READY on Kaggle. Skipping.", flush=True)
        progress["datasets"][str(ac_num)] = {
            "ref": ref,
            "status": "ready",
            "completed_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }
        save_progress(progress)
        return True

    # Ensure dataset-metadata.json is present
    meta_path = os.path.join(folder_path, "dataset-metadata.json")
    if not os.path.exists(meta_path):
        meta_content = {
            "title": slug,
            "id": ref,
            "licenses": [{"name": "CC0-1.0"}],
        }
        with open(meta_path, "w", encoding="utf-8") as f:
            json.dump(meta_content, f, indent=2)
        print(f"[AC {ac_num}] Created metadata at {meta_path}", flush=True)

    files = [f for f in os.listdir(folder_path) if f.endswith(".pdf")]
    total_size_mb = sum(os.path.getsize(os.path.join(folder_path, f)) for f in files) / (1024 * 1024)
    print(f"[AC {ac_num}] Found {len(files)} PDFs ({total_size_mb / 1024:.2f} GB). Starting upload...", flush=True)

    start_time = time.time()
    # Run kaggle datasets create
    # Use unbuffered output so progress can be monitored in real time
    process = subprocess.Popen(
        [sys.executable, "-u", "-m", "kaggle", "datasets", "create", "-p", folder_path],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
    )

    last_report_time = time.time()
    for raw_line in iter(process.stdout.readline, ""):
        line_s = raw_line.replace("\r", "\n").strip()
        if not line_s:
            continue
        for subline in line_s.split("\n"):
            subline = subline.strip()
            if not subline:
                continue
            if "Starting upload for file" in subline or "Upload successful" in subline or "created" in subline.lower() or "error" in subline.lower():
                print(f"[AC {ac_num}] {subline}", flush=True)
            elif time.time() - last_report_time > 30:
                print(f"[AC {ac_num} upload in progress] {subline[:100]}", flush=True)
                last_report_time = time.time()

    process.stdout.close()
    return_code = process.wait()

    upload_duration = time.time() - start_time
    print(f"[AC {ac_num}] Upload process finished with return code {return_code} in {upload_duration / 60:.2f} minutes.", flush=True)

    if return_code != 0:
        print(f"[AC {ac_num}] Upload failed or exited with code {return_code}. Checking if dataset was registered...", flush=True)

    # Wait for dataset to be processed
    if wait_for_dataset_ready(ref):
        print(f"[AC {ac_num}] SUCCESS! Dataset {ref} is verified READY on Kaggle.", flush=True)
        progress["datasets"][str(ac_num)] = {
            "ref": ref,
            "status": "ready",
            "files": len(files),
            "size_gb": round(total_size_mb / 1024, 2),
            "completed_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }
        save_progress(progress)
        return True
    else:
        print(f"[AC {ac_num}] WARNING: Dataset {ref} not ready yet.", flush=True)
        return False


def main():
    print(f"Starting batch upload of AC 3 to AC 11 datasets to Kaggle at {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    progress = load_progress()

    total = len(ACS_TO_UPLOAD)
    completed = sum(1 for ac_num, _ in ACS_TO_UPLOAD if progress.get("datasets", {}).get(str(ac_num), {}).get("status") == "ready")
    print(f"Initial state: {completed}/{total} already completed.\n", flush=True)

    for ac_num, dir_name in ACS_TO_UPLOAD:
        success = upload_ac(ac_num, dir_name, progress)
        if not success:
            print(f"[MAIN] Failed or interrupted at AC {ac_num}. Retrying once...", flush=True)
            success = upload_ac(ac_num, dir_name, progress)
            if not success:
                print(f"[MAIN] AC {ac_num} failed twice. Pausing before continuing to next AC...", flush=True)

    final_completed = sum(1 for ac_num, _ in ACS_TO_UPLOAD if progress.get("datasets", {}).get(str(ac_num), {}).get("status") == "ready")
    print(f"\n{'='*70}", flush=True)
    print(f"Batch upload finished: {final_completed}/{total} datasets ready on Kaggle.", flush=True)
    print(f"{'='*70}", flush=True)


if __name__ == "__main__":
    main()
