"""Generate the eight built-in royalty-free background tracks.

Everything is synthesised with numpy and written as 16-bit mono WAV files into
public/music. Run:  python scripts/make_music.py
"""

from __future__ import annotations

import os
import wave

import numpy as np

SR = 22050
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public", "music")

rng = np.random.default_rng(7)


def midi_to_freq(midi: float) -> float:
    return 440.0 * (2.0 ** ((midi - 69) / 12.0))


def adsr(n: int, attack: float, decay: float, sustain: float, release: float) -> np.ndarray:
    env = np.full(n, sustain, dtype=np.float64)
    a = min(n, max(1, int(attack * SR)))
    d = min(max(0, n - a), max(0, int(decay * SR)))
    r = min(n, max(1, int(release * SR)))
    env[:a] = np.linspace(0.0, 1.0, a)
    if d:
        env[a : a + d] = np.linspace(1.0, sustain, d)
    env[n - r :] *= np.linspace(1.0, 0.0, r)
    return env


def tone(freq: float, dur: float, kind: str, amp: float) -> np.ndarray:
    n = max(1, int(dur * SR))
    t = np.arange(n) / SR
    if kind == "piano":
        harmonics = [(1, 1.0), (2, 0.42), (3, 0.2), (4, 0.1), (5, 0.05)]
        wave = sum(a * np.sin(2 * np.pi * freq * h * t) for h, a in harmonics)
        env = np.exp(-3.2 * t / max(dur, 0.05)) * adsr(n, 0.004, 0.04, 0.9, 0.18)
    elif kind == "pad":
        wave = (
            np.sin(2 * np.pi * freq * t)
            + 0.45 * np.sin(2 * np.pi * freq * 1.004 * t)
            + 0.35 * np.sin(2 * np.pi * freq * 0.996 * t)
            + 0.12 * np.sin(2 * np.pi * freq * 2 * t)
        )
        env = adsr(n, 0.9, 0.6, 0.7, 1.4)
    elif kind == "bell":
        partials = [(1, 1.0), (2.01, 0.45), (2.98, 0.22), (4.2, 0.1), (5.4, 0.05)]
        wave = sum(a * np.sin(2 * np.pi * freq * h * t) for h, a in partials)
        env = np.exp(-2.4 * t / max(dur, 0.05))
    elif kind == "pluck":
        wave = (
            np.sin(2 * np.pi * freq * t)
            + 0.55 * np.sin(2 * np.pi * freq * 2 * t)
            + 0.22 * np.sin(2 * np.pi * freq * 3 * t)
        )
        env = np.exp(-4.2 * t / max(dur, 0.05))
    else:  # sine
        wave = np.sin(2 * np.pi * freq * t)
        env = adsr(n, 0.02, 0.1, 0.8, 0.3)
    return amp * wave * env


def kick(dur: float = 0.3, amp: float = 0.5) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n) / SR
    freq = 120 * np.exp(-20 * t) + 46
    phase = 2 * np.pi * np.cumsum(freq) / SR
    return amp * np.sin(phase) * np.exp(-8 * t)


def hat(dur: float = 0.06, amp: float = 0.09) -> np.ndarray:
    n = int(dur * SR)
    return amp * rng.standard_normal(n) * np.exp(-40 * np.arange(n) / SR)


def mix(buffer: np.ndarray, sound: np.ndarray, at_seconds: float) -> None:
    start = max(0, int(at_seconds * SR))
    end = min(len(buffer), start + len(sound))
    if end > start:
        buffer[start:end] += sound[: end - start]


def render(events, bpm: float, beats: float, percussion=None) -> np.ndarray:
    seconds_per_beat = 60.0 / bpm
    total = int(beats * seconds_per_beat * SR) + int(SR * 1.5)
    buffer = np.zeros(total, dtype=np.float64)

    for start_beat, dur_beats, midi, amp, kind in events:
        sound = tone(midi_to_freq(midi), dur_beats * seconds_per_beat, kind, amp)
        mix(buffer, sound, start_beat * seconds_per_beat)

    for start_beat, kind, amp in percussion or []:
        sound = kick(amp=amp) if kind == "kick" else hat(amp=amp)
        mix(buffer, sound, start_beat * seconds_per_beat)

    return buffer


def chord(start: float, duration: float, midis, amp: float, kind: str, spread: float = 0.0):
    return [(start + i * spread, duration, midi, amp, kind) for i, midi in enumerate(midis)]


def arpeggio(start: float, step: float, midis, amp: float, kind: str, repeats: int = 1):
    events = []
    index = 0
    for _ in range(repeats):
        for midi in midis:
            events.append((start + index * step, step * 1.6, midi, amp, kind))
            index += 1
    return events


def finish(buffer: np.ndarray) -> np.ndarray:
    fade_in = int(0.06 * SR)
    fade_out = int(1.2 * SR)
    buffer[:fade_in] *= np.linspace(0, 1, fade_in)
    buffer[-fade_out:] *= np.linspace(1, 0, fade_out)
    peak = np.max(np.abs(buffer)) or 1.0
    return (buffer / peak * 0.86).astype(np.float64)


def write(name: str, buffer: np.ndarray) -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    path = os.path.join(OUT_DIR, name)
    data = (np.clip(buffer, -1.0, 1.0) * 32767).astype("<i2")
    with wave.open(path, "wb") as handle:
        handle.setnchannels(1)
        handle.setsampwidth(2)
        handle.setframerate(SR)
        handle.writeframes(data.tobytes())
    print(f"{name}: {len(data) / SR:.1f}s, {os.path.getsize(path) / 1024:.0f} KB")


# 1. Romantic piano ---------------------------------------------------------
def romantic_piano():
    progression = [
        (0, [57, 60, 64, 69], 45),   # Am
        (4, [53, 57, 60, 65], 41),   # F
        (8, [48, 52, 55, 60], 36),   # C
        (12, [55, 59, 62, 67], 43),  # G
    ]
    events = []
    for cycle in range(2):
        for start, notes, bass in progression:
            base = start + cycle * 16
            events += chord(base, 4.0, [bass], 0.26, "pad")
            events += arpeggio(base, 0.5, notes + notes[:2], 0.17, "piano", repeats=1)
        events += [(bar + cycle * 16, 1.0, midi, 0.2, "piano") for bar, midi in
                   [(1, 76), (2.5, 72), (6, 69), (7.5, 72), (9, 76), (10.5, 79), (14, 74), (15, 71)]]
    return render(events, 72, 32)


# 2. Happy birthday ---------------------------------------------------------
def happy_birthday():
    melody = [
        (0, 0.75, 60), (0.75, 0.75, 60), (1.5, 1.5, 62), (3, 1.5, 60),
        (4.5, 1.5, 65), (6, 3, 64),
        (9, 0.75, 60), (9.75, 0.75, 60), (10.5, 1.5, 62), (12, 1.5, 60),
        (13.5, 1.5, 67), (15, 3, 65),
        (18, 0.75, 60), (18.75, 0.75, 60), (19.5, 1.5, 72), (21, 1.5, 69),
        (22.5, 1.5, 65), (24, 1.5, 64), (25.5, 3, 62),
        (28.5, 0.75, 70), (29.25, 0.75, 70), (30, 1.5, 69), (31.5, 1.5, 65),
        (33, 1.5, 67), (34.5, 4, 65),
    ]
    events = [(start, dur, midi, 0.3, "piano") for start, dur, midi in melody]
    for bar in range(0, 36, 4):
        events += chord(bar, 3.8, [48, 52, 55], 0.12, "pad")
    return render(events, 100, 40)


# 3. Soft acoustic ----------------------------------------------------------
def soft_acoustic():
    shapes = [
        (0, [50, 57, 62, 66, 62, 57], 38),
        (4, [47, 54, 59, 62, 59, 54], 35),
        (8, [43, 50, 55, 59, 55, 50], 31),
        (12, [45, 52, 57, 61, 57, 52], 33),
    ]
    events = []
    for cycle in range(2):
        for start, notes, bass in shapes:
            base = start + cycle * 16
            events.append((base, 4.0, bass, 0.26, "pluck"))
            events += arpeggio(base, 0.5, notes, 0.15, "pluck")
        for offset, midi in [(2, 69), (6, 66), (10, 71), (14, 69)]:
            events.append((offset + cycle * 16, 1.5, midi, 0.18, "pluck"))
    return render(events, 84, 32)


# 4. Cinematic love ---------------------------------------------------------
def cinematic_love():
    chords = [
        (0, [48, 52, 55, 59]),
        (4, [45, 48, 52, 55]),
        (8, [41, 45, 48, 52]),
        (12, [43, 47, 50, 55]),
    ]
    events = []
    for cycle in range(2):
        for start, midis in chords:
            base = start + cycle * 16
            events += chord(base, 4.2, midis, 0.2, "pad")
            events += chord(base, 4.2, [m + 12 for m in midis[:2]], 0.08, "pad", spread=0.02)
        for offset, midi in [(1, 84), (5, 81), (9, 79), (13, 81)]:
            events.append((offset + cycle * 16, 3.0, midi, 0.12, "sine"))
    return render(events, 60, 32)


# 5. Celebration ------------------------------------------------------------
def celebration():
    chords = [
        (0, [60, 64, 67, 72], 48),
        (4, [65, 69, 72, 77], 53),
        (8, [57, 60, 64, 69], 45),
        (12, [55, 59, 62, 67], 43),
    ]
    events = []
    percussion = []
    for cycle in range(2):
        for start, notes, bass in chords:
            base = start + cycle * 16
            events.append((base, 4.0, bass, 0.24, "pluck"))
            events += arpeggio(base, 0.5, notes, 0.14, "piano")
        for beat in range(16):
            percussion.append((beat + cycle * 16, "kick", 0.42))
            percussion.append((beat + cycle * 16 + 0.5, "hat", 0.1))
        for offset, midi in [(0, 84), (3, 79), (7, 81), (11, 84)]:
            events.append((offset + cycle * 16, 1.0, midi, 0.16, "pluck"))
    return render(events, 120, 32, percussion)


# 6. Lo-fi chill ------------------------------------------------------------
def lofi_chill():
    chords = [
        (0, [48, 52, 55, 58]),
        (4, [45, 48, 52, 55]),
        (8, [41, 45, 48, 51]),
        (12, [43, 47, 50, 53]),
    ]
    events = []
    percussion = []
    for cycle in range(2):
        for start, midis in chords:
            base = start + cycle * 16
            events += chord(base, 3.9, midis, 0.17, "pluck")
            events.append((base, 3.9, midis[0] - 12, 0.22, "sine"))
        for beat in range(0, 32, 2):
            percussion.append((beat + cycle * 16, "kick", 0.3))
            percussion.append((beat + cycle * 16 + 1, "hat", 0.07))
    buffer = render(events, 70, 32, percussion)
    # soft vinyl hiss
    hiss = rng.standard_normal(len(buffer)) * 0.012
    hiss *= np.hanning(len(buffer))
    return buffer + hiss


# 7. Wedding bells ----------------------------------------------------------
def wedding_bells():
    progression = [
        (0, [48, 55, 60, 64]),
        (4, [43, 50, 55, 59]),
        (8, [45, 52, 57, 60]),
        (12, [41, 48, 53, 57]),
    ]
    events = []
    for cycle in range(2):
        for start, midis in progression:
            base = start + cycle * 16
            events += arpeggio(base, 1.0, [m + 12 for m in midis], 0.16, "bell")
            events += chord(base, 4.0, [midis[0] - 12], 0.18, "pad")
        for offset, midi in [(0, 88), (6, 84), (12, 86)]:
            events.append((offset + cycle * 16, 2.0, midi, 0.12, "bell"))
    return render(events, 66, 32)


# 8. Christmas bells --------------------------------------------------------
def christmas_bells():
    melody = [
        (0, 1, 64), (1, 1, 64), (2, 2, 64),
        (4, 1, 64), (5, 1, 64), (6, 2, 64),
        (8, 1, 64), (9, 1, 67), (10, 1.5, 60), (11.5, 0.5, 62), (12, 2, 64),
        (14, 1, 65), (15, 1, 65), (16, 1, 65), (17, 1, 65),
        (18, 1, 65), (19, 1, 64), (20, 1, 64), (21, 1, 64),
        (22, 1, 62), (23, 1, 62), (24, 1, 64), (25, 1, 62), (26, 2, 67),
    ]
    events = [(start, dur, midi, 0.26, "bell") for start, dur, midi in melody]
    for bar in range(0, 28, 4):
        events += chord(bar, 3.6, [48, 52, 55], 0.1, "pad")
    percussion = [(beat, "hat", 0.06) for beat in range(0, 28, 1)]
    return render(events, 110, 30, percussion)


def main() -> None:
    write("romantic-piano.wav", finish(romantic_piano()))
    write("happy-birthday.wav", finish(happy_birthday()))
    write("soft-acoustic.wav", finish(soft_acoustic()))
    write("cinematic-love.wav", finish(cinematic_love()))
    write("celebration.wav", finish(celebration()))
    write("lofi-chill.wav", finish(lofi_chill()))
    write("wedding-bells.wav", finish(wedding_bells()))
    write("christmas-bells.wav", finish(christmas_bells()))


if __name__ == "__main__":
    main()
