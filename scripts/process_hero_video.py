from __future__ import annotations

import math
from pathlib import Path

import cv2
import imageio.v2 as imageio
import numpy as np


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "images and videos" / "From KlickPin CF Try Simple packing list ideas that can instantly upgrade your look room party or daily routine for ideas worth saving right now - Pin-668784613458102207.mp4"
OUTPUT = ROOT / "public" / "hero-background.mp4"

SEGMENT_START = 66
SEGMENT_END = 156
OUTPUT_FPS = 60
STABILIZE_RADIUS = 10
ZOOM = 1.04


def read_segment(path: Path, start: int, end: int) -> list[np.ndarray]:
    cap = cv2.VideoCapture(str(path))
    frames: list[np.ndarray] = []
    cap.set(cv2.CAP_PROP_POS_FRAMES, start)
    for _ in range(start, end + 1):
        ok, frame = cap.read()
        if not ok:
            break
        frames.append(frame)
    cap.release()
    if not frames:
        raise RuntimeError("Could not load source video segment.")
    return frames


def moving_average(values: np.ndarray, radius: int) -> np.ndarray:
    if radius <= 0:
        return values.copy()
    kernel = np.ones(radius * 2 + 1, dtype=np.float32) / (radius * 2 + 1)
    padded = np.pad(values, ((radius, radius), (0, 0)), mode="edge")
    return np.vstack(
        [
            np.convolve(padded[:, column], kernel, mode="valid")
            for column in range(values.shape[1])
        ]
    ).T


def estimate_transforms(frames: list[np.ndarray]) -> np.ndarray:
    transforms = np.zeros((len(frames) - 1, 3), dtype=np.float32)
    prev_gray = cv2.cvtColor(frames[0], cv2.COLOR_BGR2GRAY)

    for index in range(len(frames) - 1):
        curr_gray = cv2.cvtColor(frames[index + 1], cv2.COLOR_BGR2GRAY)
        points = cv2.goodFeaturesToTrack(
            prev_gray,
            maxCorners=200,
            qualityLevel=0.01,
            minDistance=20,
            blockSize=3,
        )
        if points is None or len(points) < 6:
            prev_gray = curr_gray
            continue

        next_points, status, _ = cv2.calcOpticalFlowPyrLK(prev_gray, curr_gray, points, None)
        if next_points is None or status is None:
            prev_gray = curr_gray
            continue

        valid_prev = points[status.flatten() == 1]
        valid_next = next_points[status.flatten() == 1]
        if len(valid_prev) < 6 or len(valid_next) < 6:
            prev_gray = curr_gray
            continue

        matrix, _ = cv2.estimateAffinePartial2D(valid_prev, valid_next)
        if matrix is None:
            prev_gray = curr_gray
            continue

        dx = matrix[0, 2]
        dy = matrix[1, 2]
        da = math.atan2(matrix[1, 0], matrix[0, 0])
        transforms[index] = [dx, dy, da]
        prev_gray = curr_gray

    return transforms


def stabilize(frames: list[np.ndarray]) -> list[np.ndarray]:
    transforms = estimate_transforms(frames)
    trajectory = np.cumsum(transforms, axis=0)
    smooth_trajectory = moving_average(trajectory, STABILIZE_RADIUS)
    difference = smooth_trajectory - trajectory
    smooth_transforms = transforms + difference

    stabilized = [frames[0]]
    height, width = frames[0].shape[:2]
    center = (width / 2.0, height / 2.0)

    for index in range(1, len(frames)):
        dx, dy, da = smooth_transforms[index - 1]
        cos_a = math.cos(da)
        sin_a = math.sin(da)
        matrix = np.array(
            [[cos_a, -sin_a, dx], [sin_a, cos_a, dy]],
            dtype=np.float32,
        )
        warped = cv2.warpAffine(
            frames[index],
            matrix,
            (width, height),
            flags=cv2.INTER_LINEAR,
            borderMode=cv2.BORDER_REFLECT,
        )
        zoom_matrix = cv2.getRotationMatrix2D(center, 0, ZOOM)
        zoomed = cv2.warpAffine(
            warped,
            zoom_matrix,
            (width, height),
            flags=cv2.INTER_LINEAR,
            borderMode=cv2.BORDER_REFLECT,
        )
        stabilized.append(zoomed)

    return stabilized


def interpolate_halfway(frame_a: np.ndarray, frame_b: np.ndarray) -> np.ndarray:
    gray_a = cv2.cvtColor(frame_a, cv2.COLOR_BGR2GRAY)
    gray_b = cv2.cvtColor(frame_b, cv2.COLOR_BGR2GRAY)
    flow = cv2.calcOpticalFlowFarneback(
        gray_a,
        gray_b,
        None,
        pyr_scale=0.5,
        levels=3,
        winsize=21,
        iterations=3,
        poly_n=5,
        poly_sigma=1.2,
        flags=0,
    )

    height, width = gray_a.shape
    grid_x, grid_y = np.meshgrid(np.arange(width), np.arange(height))
    map_x_forward = (grid_x + flow[..., 0] * 0.5).astype(np.float32)
    map_y_forward = (grid_y + flow[..., 1] * 0.5).astype(np.float32)
    map_x_backward = (grid_x - flow[..., 0] * 0.5).astype(np.float32)
    map_y_backward = (grid_y - flow[..., 1] * 0.5).astype(np.float32)

    warp_a = cv2.remap(frame_a, map_x_forward, map_y_forward, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
    warp_b = cv2.remap(frame_b, map_x_backward, map_y_backward, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
    return cv2.addWeighted(warp_a, 0.5, warp_b, 0.5, 0)


def create_slow_motion(frames: list[np.ndarray]) -> list[np.ndarray]:
    result: list[np.ndarray] = []
    for index in range(len(frames) - 1):
        frame_a = frames[index]
        frame_b = frames[index + 1]
        result.append(frame_a)
        result.append(interpolate_halfway(frame_a, frame_b))
    result.append(frames[-1])
    return result


def make_ping_pong(frames: list[np.ndarray]) -> list[np.ndarray]:
    if len(frames) < 3:
        return frames
    return frames + frames[-2:0:-1] + [frames[0]]


def apply_color_grade(frame: np.ndarray) -> np.ndarray:
    image = frame.astype(np.float32) / 255.0
    lab = cv2.cvtColor((image * 255).astype(np.uint8), cv2.COLOR_BGR2LAB)
    l_channel, a_channel, b_channel = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=1.8, tileGridSize=(8, 8))
    l_channel = clahe.apply(l_channel)
    graded = cv2.merge((l_channel, a_channel, b_channel))
    image = cv2.cvtColor(graded, cv2.COLOR_LAB2BGR).astype(np.float32) / 255.0

    luma = (0.2126 * image[..., 2]) + (0.7152 * image[..., 1]) + (0.0722 * image[..., 0])
    shadow_mask = np.clip((0.52 - luma) / 0.52, 0.0, 1.0)[..., None]
    highlight_mask = np.clip((luma - 0.42) / 0.58, 0.0, 1.0)[..., None]

    image[..., 0] += shadow_mask[..., 0] * 0.03
    image[..., 1] += shadow_mask[..., 0] * 0.01
    image[..., 2] -= shadow_mask[..., 0] * 0.01

    image[..., 2] += highlight_mask[..., 0] * 0.04
    image[..., 1] += highlight_mask[..., 0] * 0.02
    image[..., 0] -= highlight_mask[..., 0] * 0.01

    image = np.clip(image, 0.0, 1.0)
    image = np.power(image, 0.95)
    image = np.clip((image - 0.5) * 1.08 + 0.5, 0.0, 1.0)

    blurred = cv2.GaussianBlur(image, (0, 0), 1.0)
    sharpened = cv2.addWeighted(image, 1.18, blurred, -0.18, 0)
    return np.clip(sharpened * 255.0, 0, 255).astype(np.uint8)


def add_temporal_motion_blur(frames: list[np.ndarray]) -> list[np.ndarray]:
    result: list[np.ndarray] = []
    for index, frame in enumerate(frames):
        prev_frame = frames[index - 1] if index > 0 else frame
        next_frame = frames[index + 1] if index < len(frames) - 1 else frame
        blended = cv2.addWeighted(prev_frame, 0.18, frame, 0.64, 0)
        blended = cv2.addWeighted(blended, 1.0, next_frame, 0.18, 0)
        result.append(np.clip(blended, 0, 255).astype(np.uint8))
    return result


def soften_loop(frames: list[np.ndarray], blend_frames: int = 24) -> list[np.ndarray]:
    if len(frames) <= blend_frames * 2:
        return frames
    output = [frame.copy() for frame in frames]
    for offset in range(blend_frames):
        alpha = (offset + 1) / (blend_frames + 1)
        tail_index = len(output) - blend_frames + offset
        head_index = offset
        output[tail_index] = cv2.addWeighted(
            output[tail_index],
            1.0 - alpha,
            output[head_index],
            alpha,
            0,
        )
    output[-1] = output[0].copy()
    return output


def write_video(path: Path, frames: list[np.ndarray], fps: int) -> None:
    writer = imageio.get_writer(
        path,
        fps=fps,
        codec="libx264",
        quality=8,
        pixelformat="yuv420p",
        macro_block_size=None,
    )
    for frame in frames:
        writer.append_data(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    writer.close()


def main() -> None:
    frames = read_segment(SOURCE, SEGMENT_START, SEGMENT_END)
    frames = stabilize(frames)
    frames = create_slow_motion(frames)
    frames = make_ping_pong(frames)
    frames = add_temporal_motion_blur(frames)
    frames = [apply_color_grade(frame) for frame in frames]
    frames = soften_loop(frames)
    write_video(OUTPUT, frames, OUTPUT_FPS)
    print(f"Wrote processed hero loop to {OUTPUT}")


if __name__ == "__main__":
    main()
