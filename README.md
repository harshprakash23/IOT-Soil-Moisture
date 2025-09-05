# IoT-Based Cloud Soil Moisture Monitoring (Software Simulation)

A **software-only** project that simulates a soil moisture sensor and uploads readings to **ThingSpeak Cloud**.
Comes with an optional **Flask dashboard** to visualize recent values.

> Rate limit note: ThingSpeak allows **1 update every 15 seconds** per channel.

---

## 📦 Project Structure
```
iot-soil-moisture-sim/
├─ .vscode/
│  ├─ launch.json
│  └─ tasks.json
├─ src/
│  ├─ config.py
│  ├─ simulator.py
│  ├─ uploader.py
│  ├─ run.py
│  └─ dashboard/
│     └─ app.py
├─ .env.example
├─ requirements.txt
└─ README.md
```

---

## ✅ Prerequisites
- Python **3.10+**
- VS Code
- A free **ThingSpeak** account and channel (Channel ID + **Write API Key**, optional **Read API Key**)

---

## 🚀 Quick Start (VS Code)
1) **Open this folder in VS Code**  
2) Create a virtual environment (Terminal → New Terminal):
   - **Windows (PowerShell):**
     ```powershell
     python -m venv .venv
     .\.venv\Scripts\Activate.ps1
     ```
   - **macOS / Linux:**
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```
3) **Install dependencies**  
   ```bash
   pip install -r requirements.txt
   ```

4) **Configure environment variables**  
   - Duplicate `.env.example` → rename to `.env`  
   - Fill in your `THINGSPEAK_WRITE_API_KEY`, `THINGSPEAK_CHANNEL_ID` (and optional `THINGSPEAK_READ_API_KEY`).

5) **Run the simulator + uploader (recommended)**  
   - Press **F5** in VS Code (Debug) or run:
     ```bash
     python src/run.py
     ```

6) **View your ThingSpeak channel** to see live updates.

7) **(Optional) Run the local Flask dashboard**
   ```bash
   python src/dashboard/app.py
   ```
   Open http://127.0.0.1:5000/

---

## 🧪 What to Expect
- Console prints a new moisture value every 15 seconds and upload status.
- ThingSpeak updates your chart live.
- Local dashboard shows the last N values and a simple status.

---

## 🔧 Customization
- Edit thresholds in `simulator.py` (`DRY`, `WET`).
- Tweak the simulated pattern (diurnal curve + noise).
- Change upload interval in `run.py` (ensure ≥ 15s for ThingSpeak).

---

## ❓ Troubleshooting
- **HTTP 0 / timeouts** → Check your internet connection.
- **HTTP 429 (Too Many Requests)** → Increase interval ≥ 15s.
- **Invalid API key** → Re-check `.env` values.
- **No graph updates** → Ensure you used the correct **channel** (Channel ID) and **Field1** is used.

---

## 📜 License
MIT (do whatever you want, educational use encouraged).
