from flask import Flask, jsonify, render_template_string, request
import os, requests
from config import THINGSPEAK_CHANNEL_ID, THINGSPEAK_READ_API_KEY

app = Flask(__name__)

TPL = """
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Soil Moisture Dashboard</title>
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin: 20px; }
    .card { border: 1px solid #ddd; border-radius: 12px; padding: 16px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .title { font-size: 20px; font-weight: 600; margin-bottom: 8px; }
    .grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #eee; padding: 8px; text-align: left; }
    th { background: #f8f8f8; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 12px; }
    .dry { background: #ffe2e2; }
    .normal { background: #e9f5ff; }
    .wet { background: #e5ffea; }
  </style>
</head>
<body>
  <div class="card">
    <div class="title">Soil Moisture – Recent Readings</div>
    <form method="get">
      <label>Show last 
        <input type="number" min="5" max="200" name="n" value="{{n}}" style="width:64px">
        samples
      </label>
      <button type="submit">Refresh</button>
    </form>
  </div>

  <div class="grid">
    <div class="card">
      <div class="title">Live Table</div>
      <table>
        <thead>
          <tr><th>Timestamp</th><th>Moisture (%)</th><th>Status</th></tr>
        </thead>
        <tbody>
        {% for r in rows %}
          <tr>
            <td>{{ r.created_at.replace('T',' ').replace('Z','') }}</td>
            <td>{{ r.value }}</td>
            <td>
              {% if r.status == 'DRY' %}
                <span class="badge dry">DRY – Irrigation Needed</span>
              {% elif r.status == 'WET' %}
                <span class="badge wet">WET – Sufficient</span>
              {% else %}
                <span class="badge normal">NORMAL</span>
              {% endif %}
            </td>
          </tr>
        {% endfor %}
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>
"""

def classify(val: int) -> str:
    try:
        v = int(val)
    except:
        return "NORMAL"
    if v < 30: return "DRY"
    if v > 70: return "WET"
    return "NORMAL"

@app.route("/")
def index():
    n = int(request.args.get("n", "25"))
    n = max(5, min(200, n))

    channel_id = THINGSPEAK_CHANNEL_ID
    read_key = THINGSPEAK_READ_API_KEY

    params = {"results": n}
    if read_key:
        params["api_key"] = read_key

    if not channel_id:
        rows = []
    else:
        url = f"https://api.thingspeak.com/channels/{channel_id}/fields/1.json"
        try:
            data = requests.get(url, params=params, timeout=10).json()
            feeds = data.get("feeds", [])
            rows = [{
                "created_at": f.get("created_at", ""),
                "value": f.get("field1", "0"),
                "status": classify(f.get("field1", "0"))
            } for f in feeds if f.get("field1") is not None]
            rows.reverse()  # newest first
        except Exception:
            rows = []

    return render_template_string(TPL, rows=rows, n=n)

@app.route("/api/health")
def health():
    return jsonify({"ok": True})

if __name__ == "__main__":
    app.run(debug=True)
