from typing import Optional, Dict, Any
import requests
import time

THINGSPEAK_UPDATE_URL = "https://api.thingspeak.com/update"

class ThingSpeakClient:
    def __init__(self, api_key: str, timeout: int = 10):
        self.api_key = api_key
        self.timeout = timeout

    def upload_value(self, field_value: int, field_no: int = 1) -> bool:
        params = {
            "api_key": self.api_key,
            f"field{field_no}": field_value
        }
        try:
            resp = requests.get(THINGSPEAK_UPDATE_URL, params=params, timeout=self.timeout)
            # ThingSpeak returns an entry_id (int) on success, "0" on failure
            if resp.status_code == 200 and resp.text.strip() != "0":
                return True
            return False
        except requests.RequestException:
            return False
