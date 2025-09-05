# React Frontend Dashboard

The `thingspeak-react` folder contains a modern React dashboard for real-time visualization of soil moisture data. It features:
- Live charting and historical trends
- Status cards for current, average, and last update
- Responsive design for desktop and mobile
- Table of recent readings

#### Setup & Usage
1. Open a terminal and navigate to the frontend folder:
	```sh
	cd thingspeak-react
	npm install
	npm run dev
	```
2. Visit [http://localhost:5173](http://localhost:5173) in your browser.
3. Configure your ThingSpeak channel ID and API keys in `src/App.jsx` if needed.

---

# IOT Soil Moisture Monitoring System

## Overview
This project is an end-to-end IoT solution for monitoring soil moisture in real time. It includes a Python-based simulator, data uploader to ThingSpeak, and a modern React dashboard for visualization.

## Features
- **Simulator:** Simulates soil moisture sensor readings.
- **Uploader:** Sends data to ThingSpeak IoT cloud.
- **Dashboard:** Beautiful React frontend for live data visualization and historical trends.
- **Configurable:** Easily adjust update intervals and API keys.

## Folder Structure
- `src/` - Python backend (simulator, uploader, config)
- `src/dashboard/` - Flask dashboard backend (optional)
- `thingspeak-react/` - React frontend dashboard

## Getting Started

### 1. Python Backend
#### Install dependencies
```sh
pip install -r requirements.txt
```

#### Run the simulator
```sh
python src/run.py
```

#### Configuration
Edit `src/config.py` to set your ThingSpeak API keys and update interval.

### 2. React Frontend
#### Setup
```sh
cd thingspeak-react
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Dashboard (Optional)
If using the Flask dashboard:
```sh
python src/dashboard/app.py
```

## ThingSpeak Integration
Set your ThingSpeak channel ID and API keys in `src/config.py` and `thingspeak-react/src/App.jsx`.

## Screenshots
<img width="597" height="927" alt="image" src="https://github.com/user-attachments/assets/caf1994d-23a6-4283-9e3c-3c1458d4c155" />


## License
MIT

---
Made with ❤️ by harshprakash23
