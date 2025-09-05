import os
from dotenv import load_dotenv

# Load .env if present
load_dotenv()

THINGSPEAK_WRITE_API_KEY = os.getenv("THINGSPEAK_WRITE_API_KEY", "").strip()
THINGSPEAK_READ_API_KEY  = os.getenv("THINGSPEAK_READ_API_KEY", "").strip()
THINGSPEAK_CHANNEL_ID    = os.getenv("THINGSPEAK_CHANNEL_ID", "").strip()
UPDATE_PERIOD_SECONDS    = int(os.getenv("UPDATE_PERIOD_SECONDS", "15"))

# Validation helpers
def require(key: str, value: str) -> str:
    if not value:
        raise RuntimeError(f"Missing required environment variable: {key}")
    return value
