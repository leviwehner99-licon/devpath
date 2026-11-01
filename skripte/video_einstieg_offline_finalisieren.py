"""Ergänzt das Descript-Video ohne Cloud-Credits um sieben Schluss-Szenen.

Die Descript-Fassung bleibt als Quelle erhalten. FFmpeg übernimmt ihren Ton und
die eingebrannten Untertitel; transparente Pillow-Grafiken ersetzen nur den
oberen Bildbereich von Kapitel 13.
"""
from __future__ import annotations

import subprocess
import sys
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / ".video-tools"))
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

VIDEO = ROOT / "public" / "videos"
SOURCE_DIR = ROOT / "skripte" / "video-quelle"
SOURCE = SOURCE_DIR / "einstieg-descript-kopie.mp4"
OUTPUT = VIDEO / "einstieg-programmierung-final.mp4"
ASSETS = SOURCE_DIR / "assets"
W, H = 1280, 720
NAVY = "#0C1C3A"
CARD = "#142B50"
CYAN = "#45D9E8"
ORANGE = "#FF9F42"
WHITE = "#F7FAFF"
MUTED = "#B3C8E3"

BEATS = [
    (896.30, 910.60, "DEIN NÄCHSTER LERNWEG", "Vom Verstehen zum Bauen", "weg"),
    (910.60, 925.90, "WÄHLE EIN THEMA", "Drei gute Startpunkte", "wahl"),
    (925.90, 931.50, "MACH ERFOLG SICHTBAR", "Normalfall und Fehlerfall", "faelle"),
    (931.50, 938.40, "BAUE KLEIN", "Eine lauffähige erste Version", "version"),
    (938.40, 952.30, "WENN DU FESTSTECKST", "Erkläre es an einem kleinen Beispiel", "hilfe"),
    (952.30, 957.30, "LERNZYKLUS", "Bauen, prüfen, verbessern", "zyklus"),
    (957.30, 967.20, "JETZT BIST DU DRAN", "Welches Problem löst du zuerst?", "schluss"),
]


def font(size: int, bold: bool = False):
    return ImageFont.truetype(str(Path("C:/Windows/Fonts") / ("segoeuib.ttf" if bold else "segoeui.ttf")), size)


def text(draw, x, y, value, size, color=WHITE, bold=False):
    draw.text((x, y), value, font=font(size, bold), fill=color)


def panel(draw, rect, fill=CARD, outline=None):
    draw.rounded_rectangle(rect, radius=20, fill=fill, outline=outline, width=3 if outline else 1)


def base(label, title):
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, W, 562), fill=NAVY)
    d.ellipse((-210, -220, 315, 300), fill="#112B54")
    text(d, 60, 34, "CODEZONE  /  EINSTIEG IN DIE PROGRAMMIERUNG", 17, CYAN, True)
    text(d, 1045, 34, "13 / 13", 18, CYAN, True)
    text(d, 60, 88, label, 20, CYAN, True)
    text(d, 60, 125, title, 42, WHITE, True)
    return im, d


def three_cards(d, titles, details, active=None):
    for i, (name, detail) in enumerate(zip(titles, details)):
        x = 60 + i * 405
        panel(d, (x, 236, x + 370, 462), CARD, ORANGE if i == active else CYAN)
        text(d, x + 22, 262, f"0{i + 1}", 20, ORANGE, True)
        text(d, x + 22, 312, name, 29, WHITE, True)
        text(d, x + 22, 370, detail, 20, MUTED)


def render_beat(label, title, kind):
    im, d = base(label, title)
    if kind == "weg":
        three_cards(d, ["Problem", "Regel", "Test"], ["Was soll gelingen?", "Wie genau?", "Funktioniert es?"])
        text(d, 79, 490, "Aus einer Idee wird ein prüfbares Programm.", 22, ORANGE, True)
    elif kind == "wahl":
        three_cards(d, ["Webseite", "Spiel", "Daten"], ["Kursfinder bauen", "Figur bewegen", "Liste untersuchen"])
        text(d, 79, 490, "Wähle das Thema, das dich wirklich interessiert.", 22, ORANGE, True)
    elif kind == "faelle":
        panel(d, (60, 235, 625, 468), CARD, CYAN)
        panel(d, (655, 235, 1220, 468), CARD, ORANGE)
        text(d, 90, 270, "NORMALFALL", 22, CYAN, True)
        text(d, 90, 342, "Spiel → Spieleentwicklung", 28, WHITE, True)
        text(d, 685, 270, "FEHLERFALL", 22, ORANGE, True)
        text(d, 685, 342, "xyz → Kein Kurs", 28, WHITE, True)
    elif kind == "version":
        three_cards(d, ["Starten", "Prüfen", "Verbessern"], ["Kleine Version", "Zwei Testfälle", "Einen Fehler lösen"], 1)
        text(d, 79, 490, "Eine kleine funktionierende Lösung reicht für den Anfang.", 22, ORANGE, True)
    elif kind == "hilfe":
        panel(d, (60, 238, 1220, 468), CARD, CYAN)
        text(d, 90, 267, "ZU KOMPLIZIERT?", 22, ORANGE, True)
        text(d, 90, 329, "1. Ablauf laut erklären", 29, WHITE, True)
        text(d, 90, 389, "2. Mit weniger Daten erneut probieren", 29, WHITE, True)
        text(d, 79, 493, "Der passende Themenkurs zeigt dir später Sprache und Werkzeuge.", 20, MUTED)
    elif kind == "zyklus":
        three_cards(d, ["Bauen", "Prüfen", "Lernen"], ["Kleine Lösung", "Ergebnis ansehen", "Regel verbessern"], 2)
    else:
        panel(d, (60, 233, 1220, 466), CARD, CYAN)
        text(d, 90, 271, "DEINE ERSTE PROJEKTFRAGE", 21, CYAN, True)
        text(d, 90, 333, "Woran erkennst du, dass es funktioniert?", 31, WHITE, True)
        text(d, 79, 492, "Schreibe ein Ziel auf. Baue die kleinste prüfbare Version.", 22, ORANGE, True)
    return im


def main():
    if not SOURCE.exists():
        raise FileNotFoundError(f"Descript-Kopie fehlt: {SOURCE}")
    ASSETS.mkdir(parents=True, exist_ok=True)
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    images = []
    for index, (_, _, label, title, kind) in enumerate(BEATS):
        path = ASSETS / f"schluss-{index + 1:02}.png"
        render_beat(label, title, kind).save(path, optimize=True)
        images.append(path)
    command = [ffmpeg, "-v", "error", "-y", "-i", str(SOURCE)]
    for path in images:
        command += ["-i", str(path)]
    chain = "[0:v]format=yuv420p[v0];"
    for i, (start, end, *_rest) in enumerate(BEATS, 1):
        chain += f"[v{i - 1}][{i}:v]overlay=x=0:y=0:eof_action=repeat:enable='between(t,{start:.2f},{end:.2f})'[v{i}];"
    chain = chain.rstrip(";")
    command += ["-filter_complex", chain, "-map", "[v7]", "-map", "0:a:0", "-c:v", "libx264", "-preset", "veryfast", "-crf", "22", "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", str(OUTPUT)]
    subprocess.run(command, check=True)
    subprocess.run([ffmpeg, "-v", "error", "-y", "-ss", "8", "-i", str(OUTPUT), "-frames:v", "1", str(VIDEO / "einstieg-poster-final.png")], check=True)
    old = json.loads((VIDEO / "einstieg-kapitel-neu.json").read_text(encoding="utf-8"))
    chapters = [{**chapter, "start": round(chapter["start"] + index * 3, 2)} for index, chapter in enumerate(old["chapters"])]
    (VIDEO / "einstieg-kapitel-final.json").write_text(json.dumps({"duration": 967.2, "chapters": chapters}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    raw = (VIDEO / "einstieg-programmierung-neu.vtt").read_text(encoding="utf-8").replace("\r\n", "\n")
    def sec(value):
        hours, minutes, rest = value.split(":")
        return int(hours) * 3600 + int(minutes) * 60 + float(rest)
    def timestamp(value):
        millis = round(value * 1000)
        hours, millis = divmod(millis, 3_600_000)
        minutes, millis = divmod(millis, 60_000)
        seconds, millis = divmod(millis, 1000)
        return f"{hours:02}:{minutes:02}:{seconds:02}.{millis:03}"
    lines = ["WEBVTT", ""]
    for match in re.finditer(r"(\d\d:\d\d:\d\d\.\d+) --> (\d\d:\d\d:\d\d\.\d+)\n([^\n]+)", raw):
        start, end = sec(match[1]), sec(match[2])
        chapter_index = max(index for index, chapter in enumerate(old["chapters"]) if start >= chapter["start"])
        lines.extend([f"{timestamp(start + chapter_index * 3)} --> {timestamp(end + chapter_index * 3)}", match[3], ""])
    (VIDEO / "einstieg-programmierung-final.vtt").write_text("\n".join(lines), encoding="utf-8")
    print(f"Fertig: {OUTPUT} ({OUTPUT.stat().st_size / 1_000_000:.1f} MB)")


if __name__ == "__main__":
    main()
