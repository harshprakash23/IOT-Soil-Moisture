# src/csv_logger.py
import csv
from datetime import datetime
from pathlib import Path
from typing import Optional

LOG_FILE = Path(__file__).resolve().parents[1] / "soil_log.csv"

def ensure_header():
    if not LOG_FILE.exists():
        with LOG_FILE.open("w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["timestamp", "moisture_pct", "status"])

def log_value(moisture: int, status: str):
    ensure_header()
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with LOG_FILE.open("a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([ts, moisture, status])
