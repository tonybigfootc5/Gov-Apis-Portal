from __future__ import annotations

import json
from pathlib import Path

import cv2
import numpy as np


ROOT = Path(__file__).resolve().parents[1]
VIDEO = ROOT / "public" / "hero-background.mp4"


def main() -> None:
    cap = cv2.VideoCapture(str(VIDEO))
    frames = []
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        frames.append(frame)
    cap.release()

    if not frames:
        raise RuntimeError("No frames found.")

    first = cv2.resize(frames[0], (160, 284))
    last = cv2.resize(frames[-1], (160, 284))
    penultimate = cv2.resize(frames[-2], (160, 284))

    metrics = {
        "frame_count": len(frames),
        "fps": 60,
        "duration_seconds": round(len(frames) / 60, 2),
        "first_last_mae": float(np.mean(np.abs(first.astype(np.float32) - last.astype(np.float32)))),
        "penultimate_last_mae": float(np.mean(np.abs(penultimate.astype(np.float32) - last.astype(np.float32)))),
    }
    print(json.dumps(metrics))


if __name__ == "__main__":
    main()
