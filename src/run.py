import time
from datetime import datetime
from csv_logger import log_value
from simulator import SoilMoistureSimulator, classify
from uploader import ThingSpeakClient
from config import THINGSPEAK_WRITE_API_KEY, UPDATE_PERIOD_SECONDS, require

def main():
    api_key = require("THINGSPEAK_WRITE_API_KEY", THINGSPEAK_WRITE_API_KEY)
    period = max(15, UPDATE_PERIOD_SECONDS)  # obey ThingSpeak rate limit

    sim = SoilMoistureSimulator()
    client = ThingSpeakClient(api_key=api_key)

    print(f"[START] Simulator running. Update period: {period}s (ThingSpeak requires >= 15s).")
    try:
        while True:
            value = sim.next_value()
            status = classify(value)
            ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            ok = client.upload_value(field_value=value, field_no=1)
            print(f"{ts} | Moisture: {value:3d}% | {status:6s} | Upload: {'OK' if ok else 'FAIL'}")
            log_value(value, status)
            time.sleep(period)
    except KeyboardInterrupt:
        print("\n[STOP] Simulator stopped by user.")
    

if __name__ == "__main__":
    main()
