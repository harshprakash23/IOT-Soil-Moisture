import math
import random
import time
from dataclasses import dataclass
from typing import Tuple

@dataclass
class SoilThresholds:
    DRY: int = 30      # below is dry
    WET: int = 70      # above is wet

class SoilMoistureSimulator:
    """
    Simulates realistic soil moisture values using a diurnal (daily) sine pattern
    plus random noise and occasional "rain events" that bump moisture.
    Output range: 0..100 (%)
    """
    def __init__(self, base: int = 55, noise: int = 8, rain_prob: float = 0.02):
        self.base = base
        self.noise = noise
        self.rain_prob = rain_prob
        self.current = base

    def _diurnal(self, t: float) -> float:
        # t in seconds; one cycle per 24h (86400s)
        return 10 * math.sin(2 * math.pi * (t % 86400) / 86400.0)

    def _rain_event(self) -> int:
        # Random rain increases moisture by 10-25%
        return random.randint(10, 25)

    def next_value(self, t: float = None) -> int:
        if t is None:
            t = time.time()
        drift = self._diurnal(t)
        noise = random.randint(-self.noise, self.noise)
        val = self.base + drift + noise

        # Occasional rain
        if random.random() < self.rain_prob:
            val += self._rain_event()

        # Drying trend (slowly decay towards base)
        val = 0.9 * val + 0.1 * self.base

        # Clamp to 0..100
        val = max(0, min(100, int(round(val))))
        self.current = val
        return val

def classify(value: int, thr: SoilThresholds = SoilThresholds()) -> str:
    if value < thr.DRY:
        return "DRY"
    if value > thr.WET:
        return "WET"
    return "NORMAL"
