"""Rendert das einzige Kursvideo: Einstieg in die Programmierung.

Benötigt: pillow, imageio-ffmpeg, edge-tts. Die Sprachsynthese braucht beim
Erstellen eine Internetverbindung; die fertige MP4 läuft danach lokal.
"""

from __future__ import annotations

import asyncio
import json
import math
import re
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOCAL_TOOLS = ROOT / ".video-tools"
if LOCAL_TOOLS.exists():
    sys.path.insert(0, str(LOCAL_TOOLS))

import edge_tts
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont

from video_einstieg_inhalte import CHAPTERS

WIDTH, HEIGHT, FPS = 1280, 720, 15
VOICE = "de-DE-KatjaNeural"
PAUSE = 0.7
VIDEO_DIR = ROOT / "public" / "videos"
OUTPUT = VIDEO_DIR / "einstieg-programmierung.mp4"
ACCENT = (23, 105, 224)
TEAL = (0, 107, 103)
INK = (27, 35, 55)
MUTED = (92, 107, 132)
PAPER = (247, 250, 255)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    name = "segoeuib.ttf" if bold else "segoeui.ttf"
    return ImageFont.truetype(str(Path("C:/Windows/Fonts") / name), size)


FONTS = {(size, bold): font(size, bold) for size, bold in [(15, False), (17, False), (19, False), (22, False), (24, True), (27, True), (34, True), (44, True)]}


def wrapped(draw: ImageDraw.ImageDraw, text: str, typeface: ImageFont.FreeTypeFont, width: int) -> list[str]:
    lines: list[str] = []
    current = ""
    for word in text.split():
        proposed = f"{current} {word}".strip()
        if draw.textbbox((0, 0), proposed, font=typeface)[2] > width and current:
            lines.append(current)
            current = word
        else:
            current = proposed
    if current:
        lines.append(current)
    return lines


def arrow(draw: ImageDraw.ImageDraw, x1: int, y1: int, x2: int, y2: int, color=ACCENT, width=5) -> None:
    draw.line((x1, y1, x2, y2), fill=color, width=width)
    angle = math.atan2(y2 - y1, x2 - x1)
    for side in (-0.55, 0.55):
        px = x2 - 14 * math.cos(angle + side)
        py = y2 - 14 * math.sin(angle + side)
        draw.line((x2, y2, px, py), fill=color, width=width)


def card(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], number: int, label: str, active: bool) -> None:
    x1, y1, x2, y2 = box
    draw.rounded_rectangle((x1 + 5, y1 + 8, x2 + 5, y2 + 8), radius=25, fill=(220, 228, 241))
    draw.rounded_rectangle(box, radius=25, fill=(255, 255, 255), outline=ACCENT if active else (216, 226, 242), width=4 if active else 2)
    draw.ellipse((x1 + 24, y1 + 22, x1 + 73, y1 + 71), fill=ACCENT if active else (229, 238, 252))
    draw.text((x1 + 38, y1 + 32), f"{number:02}", font=FONTS[19, False], fill=(255, 255, 255) if active else ACCENT)
    compact = y2 - y1 <= 160
    text_x = x1 + (90 if compact else 24)
    lines = wrapped(draw, label, FONTS[27, True], x2 - text_x - 24)
    start = y1 + (29 if compact else 93)
    for line in lines[:3]:
        draw.text((text_x, start), line, font=FONTS[27, True], fill=INK)
        start += 36


def layout_for(chapter_id: str) -> str:
    if chapter_id in {"program-output", "program-why", "program-input-result", "program-search-workshop"}:
        return "search"
    if chapter_id in {"program-decisions", "program-debug", "program-debug-workshop"}:
        return "branch"
    if chapter_id in {"program-repeat", "program-learning"}:
        return "loop"
    if chapter_id in {"program-ecosystem", "program-languages"}:
        return "stack"
    return "flow"


def base_slide(chapter: dict, slide_index: int, reveal: int, chapter_index: int) -> Image.Image:
    image = Image.new("RGB", (WIDTH, HEIGHT), PAPER)
    draw = ImageDraw.Draw(image)
    draw.ellipse((-160, -240, 470, 390), fill=(234, 243, 255))
    draw.ellipse((1050, 495, 1510, 955), fill=(228, 246, 242))
    draw.rounded_rectangle((48, 32, 1232, 100), radius=20, fill=(255, 255, 255), outline=(220, 231, 245), width=2)
    draw.rounded_rectangle((67, 48, 106, 84), radius=10, fill=ACCENT)
    draw.text((78, 53), "C", font=FONTS[24, True], fill=(255, 255, 255))
    draw.text((119, 55), "CODEZONE  /  GRUNDLAGEN", font=FONTS[17, False], fill=ACCENT)
    draw.text((1015, 55), f"KAPITEL {chapter_index + 1:02} / 13", font=FONTS[17, False], fill=MUTED)
    heading, labels, footer = chapter["slides"][slide_index]
    draw.text((82, 145), chapter["title"].upper(), font=FONTS[15, False], fill=TEAL)
    draw.text((82, 180), heading, font=FONTS[44, True], fill=INK)
    layout = layout_for(chapter["id"])
    if layout in {"flow", "search"}:
        positions = [(80, 290, 390, 510), (485, 290, 795, 510), (890, 290, 1200, 510)]
        for i in range(3):
            if i < reveal:
                card(draw, positions[i], i + 1, labels[i], i == min(reveal - 1, 2))
            if i < reveal - 1:
                arrow(draw, positions[i][2] + 13, 397, positions[i + 1][0] - 15, 397)
        if layout == "search":
            draw.rounded_rectangle((84, 527, 1196, 550), radius=11, fill=(220, 232, 249))
            draw.rounded_rectangle((84, 527, 84 + int(1112 * min(reveal, 3) / 3), 550), radius=11, fill=TEAL)
    elif layout == "branch":
        positions = [(463, 265, 817, 376), (160, 423, 532, 545), (748, 423, 1120, 545)]
        if reveal > 0:
            card(draw, positions[0], 1, labels[0], reveal == 1)
        if reveal > 1:
            arrow(draw, 600, 382, 350, 416)
            card(draw, positions[1], 2, labels[1], reveal == 2)
        if reveal > 2:
            arrow(draw, 680, 382, 930, 416, TEAL)
            card(draw, positions[2], 3, labels[2], True)
    elif layout == "loop":
        positions = [(475, 260, 805, 370), (148, 415, 478, 525), (802, 415, 1132, 525)]
        for i in range(min(reveal, 3)):
            card(draw, positions[i], i + 1, labels[i], i == min(reveal - 1, 2))
        if reveal > 1:
            arrow(draw, 510, 380, 440, 407)
        if reveal > 2:
            arrow(draw, 490, 470, 790, 470)
            arrow(draw, 940, 405, 780, 360, TEAL)
    else:
        positions = [(180, 270, 1100, 348), (180, 366, 1100, 444), (180, 462, 1100, 540)]
        for i in range(min(reveal, 3)):
            card(draw, positions[i], i + 1, labels[i], i == min(reveal - 1, 2))
        if reveal > 1:
            arrow(draw, 640, 351, 640, 360)
        if reveal > 2:
            arrow(draw, 640, 447, 640, 456)
    draw.rounded_rectangle((70, 588, 1210, 655), radius=18, fill=(229, 239, 253))
    draw.text((97, 608), footer, font=FONTS[22, False], fill=INK)
    draw.text((81, 672), "EINSTIEG IN DIE PROGRAMMIERUNG", font=FONTS[15, False], fill=MUTED)
    return image


async def synthesize(chapter: dict, output: Path) -> list[tuple[float, float, str]]:
    cues: list[tuple[float, float, str]] = []
    communicate = edge_tts.Communicate(chapter["voice"], VOICE, boundary="SentenceBoundary")
    with output.open("wb") as sound:
        async for event in communicate.stream():
            if event["type"] == "audio":
                sound.write(event["data"])
            elif event["type"] == "SentenceBoundary":
                cues.append((event["offset"] / 10_000_000, (event["offset"] + event["duration"]) / 10_000_000, event["text"]))
    if output.stat().st_size < 10_000:
        raise RuntimeError(f"Keine Sprachaufnahme für {chapter['id']}")
    return cues


def stamp(seconds: float) -> str:
    milliseconds = round(seconds * 1000)
    hours, milliseconds = divmod(milliseconds, 3_600_000)
    minutes, milliseconds = divmod(milliseconds, 60_000)
    seconds, milliseconds = divmod(milliseconds, 1000)
    return f"{hours:02}:{minutes:02}:{seconds:02}.{milliseconds:03}"


def render() -> None:
    if len(CHAPTERS) != 13 or len({chapter["id"] for chapter in CHAPTERS}) != 13:
        raise RuntimeError("Das Drehbuch muss alle 13 Einstiegslektionen genau einmal enthalten.")
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    VIDEO_DIR.mkdir(parents=True, exist_ok=True)
    base_slide(CHAPTERS[0], 0, 3, 0).save(VIDEO_DIR / "einstieg-poster.png", optimize=True)
    with tempfile.TemporaryDirectory(prefix="codezone-video-") as temp_name:
        temp = Path(temp_name)
        durations: list[float] = []
        chapter_cues: list[list[tuple[float, float, str]]] = []
        for index, chapter in enumerate(CHAPTERS):
            mp3 = temp / f"{index:02}.mp3"
            print(f"Sprecherstimme {index + 1}/13: {chapter['title']}", flush=True)
            chapter_cues.append(asyncio.run(synthesize(chapter, mp3)))
            wav = temp / f"{index:02}.wav"
            subprocess.run([ffmpeg, "-loglevel", "error", "-y", "-i", str(mp3), "-ar", "24000", "-ac", "1", str(wav)], check=True)
            with wave.open(str(wav), "rb") as sound:
                durations.append(sound.getnframes() / sound.getframerate())
        total = sum(durations) + PAUSE * (len(CHAPTERS) - 1)
        if not 600 <= total <= 1200:
            raise RuntimeError(f"Video liegt außerhalb von 10–20 Minuten: {total / 60:.1f} Minuten")
        wav_all = temp / "sprecher.wav"
        with wave.open(str(wav_all), "wb") as combined:
            combined.setnchannels(1)
            combined.setsampwidth(2)
            combined.setframerate(24000)
            for index in range(len(CHAPTERS)):
                with wave.open(str(temp / f"{index:02}.wav"), "rb") as source:
                    combined.writeframes(source.readframes(source.getnframes()))
                if index < len(CHAPTERS) - 1:
                    combined.writeframes(b"\0\0" * round(PAUSE * 24000))
        starts: list[dict] = []
        subtitle_lines = ["WEBVTT", ""]
        offset = 0.0
        for index, (chapter, duration, cues) in enumerate(zip(CHAPTERS, durations, chapter_cues)):
            starts.append({"id": chapter["id"], "title": chapter["title"], "start": round(offset, 2)})
            for start, end, text in cues:
                if text.strip():
                    subtitle_lines.extend([f"{stamp(offset + start)} --> {stamp(min(offset + end, offset + duration))}", re.sub(r"\s+", " ", text).strip(), ""])
            offset += duration + (PAUSE if index < len(CHAPTERS) - 1 else 0)
        (VIDEO_DIR / "einstieg-programmierung.vtt").write_text("\n".join(subtitle_lines), encoding="utf-8")
        (VIDEO_DIR / "einstieg-kapitel.json").write_text(json.dumps({"duration": round(total, 2), "chapters": starts}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        command = [ffmpeg, "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{WIDTH}x{HEIGHT}", "-r", str(FPS), "-i", "pipe:0", "-i", str(wav_all), "-c:v", "libx264", "-preset", "veryfast", "-crf", "24", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "112k", "-shortest", "-movflags", "+faststart", str(OUTPUT)]
        process = subprocess.Popen(command, stdin=subprocess.PIPE)
        try:
            for chapter_index, (chapter, duration) in enumerate(zip(CHAPTERS, durations)):
                print(f"Animation {chapter_index + 1}/13: {chapter['title']}", flush=True)
                chapter_time = duration + (PAUSE if chapter_index < len(CHAPTERS) - 1 else 0)
                count = round(chapter_time * FPS)
                slides = chapter["slides"]
                frames_per_slide = count / len(slides)
                cache: dict[tuple[int, int], Image.Image] = {}
                for frame_index in range(count):
                    slide_index = min(2, int(frame_index / frames_per_slide))
                    local = (frame_index - slide_index * frames_per_slide) / FPS
                    reveal = min(3, 1 + int(local / 0.55))
                    key = slide_index, reveal
                    if key not in cache:
                        cache[key] = base_slide(chapter, slide_index, reveal, chapter_index)
                    frame = cache[key].copy()
                    painter = ImageDraw.Draw(frame)
                    overall = (chapter_index + frame_index / count) / len(CHAPTERS)
                    painter.rounded_rectangle((70, 704, 1210, 711), radius=3, fill=(220, 230, 245))
                    painter.rounded_rectangle((70, 704, 70 + int(1140 * overall), 711), radius=3, fill=ACCENT)
                    painter.ellipse((1060 + int(12 * math.sin(frame_index / 13)), 125, 1080 + int(12 * math.sin(frame_index / 13)), 145), fill=TEAL)
                    process.stdin.write(frame.tobytes())
            process.stdin.close()
            if process.wait() != 0:
                raise RuntimeError("FFmpeg konnte das Video nicht fertigstellen.")
        finally:
            if process.poll() is None:
                process.kill()
        print(f"Fertig: {OUTPUT} ({total / 60:.2f} Minuten, {OUTPUT.stat().st_size / 1_000_000:.1f} MB)", flush=True)


if __name__ == "__main__":
    render()
