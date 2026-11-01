"""Erstellt eine visuell dichtere Fassung des einzigen Einstiegskursvideos.

Verwendet die vorhandene Sprecheraufnahme und VTT-Zeitmarken. Jedes gesprochene
Textsegment bekommt ein eigenes Bild; zwischen Kapiteln steht eine Übersicht.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / ".video-tools"))
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg
from video_einstieg_inhalte import CHAPTERS

OUT = ROOT / "public" / "videos"
W, H = 1280, 720
GAP = 2.4
BG = "#0B1325"
PANEL = "#14223B"
WHITE = "#F5F8FF"
MUTED = "#A9B8D2"
CYAN = "#62E6E0"
BLUE = "#7FAAFF"
GOLD = "#FFC879"
RECAPS = [
    ["Eine Absicht braucht eine klare Regel", "Das Programm führt die Regel aus", "Ein Test prüft das Ergebnis"],
    ["Vom Nutzerziel ausgehen", "Klein und prüfbar beginnen", "Erfolg am echten Beispiel erkennen"],
    ["Eingabe, Verarbeitung, Ergebnis trennen", "Treffer aus vorhandenen Daten wählen", "Auch ein leerer Treffer braucht eine Antwort"],
    ["Schritte brauchen eine Reihenfolge", "Der Zustand hält aktuelle Werte", "Neue Eingabe startet denselben Ablauf"],
    ["Jede Bedingung hat zwei Wege", "Leere Suche bewusst behandeln", "Randfälle gezielt testen"],
    ["Eine Schleife prüft jeden Titel", "Eine Funktion bündelt die Regel", "Erst klein, dann mit vielen Daten testen"],
    ["Drei Kurstitel als Testdaten wählen", "Eine eindeutige Suchregel formulieren", "Treffer und Leerfall vorhersagen"],
    ["Erwartung und Beobachtung trennen", "Eine Ursache gezielt prüfen", "Nach der Änderung erneut testen"],
    ["Teiltreffer statt exakter Gleichheit", "Den ursprünglichen Fall erneut prüfen", "Nachbarfälle und Schreibweise testen"],
    ["Sprache schreibt Regeln auf", "Laufzeit führt sie aus", "Werkzeuge helfen beim Entwickeln"],
    ["Die Sprache folgt dem Projektziel", "Web, Server und Apps haben andere Rollen", "Team und vorhandene Systeme zählen mit"],
    ["Browser sendet eine Anfrage", "Server prüft Regeln und Rechte", "Antwort wird sichtbar angezeigt"],
]
FONT_DIR = Path("C:/Windows/Fonts")


def f(size, bold=False):
    return ImageFont.truetype(str(FONT_DIR / ("segoeuib.ttf" if bold else "segoeui.ttf")), size)


def wrap(draw, value, font, max_width):
    lines, line = [], ""
    for word in value.split():
        test = (line + " " + word).strip()
        if line and draw.textbbox((0, 0), test, font=font)[2] > max_width:
            lines.append(line)
            line = word
        else:
            line = test
    if line:
        lines.append(line)
    return lines


def put(draw, xy, value, size, color=WHITE, bold=False, width=None, spacing=9):
    font = f(size, bold)
    lines = wrap(draw, value, font, width) if width else [value]
    x, y = xy
    for line in lines:
        draw.text((x, y), line, font=font, fill=color)
        y += size + spacing
    return y


def box(draw, rect, color=PANEL, outline=None, radius=24):
    draw.rounded_rectangle(rect, radius=radius, fill=color, outline=outline, width=2 if outline else 1)


def base(number, title, section):
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    d.ellipse((-190, -260, 420, 350), fill="#102847")
    d.ellipse((1050, 510, 1470, 930), fill="#103237")
    box(d, (48, 28, 1232, 91), "#111E35", radius=16)
    box(d, (66, 43, 105, 76), CYAN, radius=9)
    put(d, (77, 46), "C", 21, BG, True)
    put(d, (123, 47), "CODEZONE   /   EINSTIEG IN DIE PROGRAMMIERUNG", 17, WHITE, True)
    put(d, (1018, 48), f"{number:02} / 13", 18, CYAN, True)
    put(d, (61, 112), section.upper(), 18, CYAN, True)
    put(d, (61, 143), title, 40, WHITE, True, 1140)
    return im, d


def draw_example(d, chapter, slide, focus):
    heading, labels, footer = slide
    box(d, (58, 232, 1222, 525), "#111E35", radius=28)
    put(d, (84, 252), heading, 27, WHITE, True, 1050)
    chapter_id = chapter["id"]
    if chapter_id in {"program-output", "program-why", "program-input-result", "program-search-workshop", "program-debug", "program-debug-workshop"}:
        box(d, (85, 320, 410, 453), "#1A2D48", CYAN if focus == 0 else None, 18)
        put(d, (106, 338), "SCHRITT 1", 15, MUTED, True)
        put(d, (106, 373), labels[0], 23, WHITE, True, 280)
        put(d, (433, 362), "→", 36, CYAN, True)
        box(d, (491, 320, 799, 453), "#1A2D48", CYAN if focus == 1 else None, 18)
        put(d, (510, 338), "SCHRITT 2", 15, MUTED, True)
        put(d, (510, 373), labels[1], 23, WHITE, True, 270)
        put(d, (812, 362), "→", 36, CYAN, True)
        box(d, (871, 320, 1192, 453), "#1A2D48", CYAN if focus == 2 else None, 18)
        put(d, (890, 338), "SCHRITT 3", 15, MUTED, True)
        put(d, (890, 373), labels[2], 23, CYAN, True, 280)
    elif chapter_id in {"program-decisions", "program-order", "program-repeat"}:
        for i, label in enumerate(labels):
            x = 87 + 365 * i
            box(d, (x, 334, x + 330, 445), "#1A2D48", CYAN if i == focus else None, 18)
            put(d, (x + 18, 354), f"0{i + 1}", 17, CYAN, True)
            put(d, (x + 18, 385), label, 22, WHITE, True, 290)
            if i < 2:
                put(d, (x + 337, 369), "→", 26, CYAN, True)
    else:
        for i, label in enumerate(labels):
            x = 87 + 365 * i
            box(d, (x, 334, x + 330, 445), "#1A2D48", CYAN if i == focus else None, 18)
            put(d, (x + 18, 355), f"0{i + 1}", 17, CYAN, True)
            put(d, (x + 18, 384), label, 22, WHITE, True, 290)
            if i < 2:
                put(d, (x + 337, 370), "→", 26, CYAN, True)
    put(d, (87, 477), footer, 20, GOLD, False, 1080)


def make_cue(chapter, index, cue_text, cue_index, cue_total):
    phase = min(2, cue_index * 3 // max(1, cue_total))
    im, d = base(index + 1, chapter["title"], "Anschaulich erklärt")
    draw_example(d, chapter, chapter["slides"][phase], phase)
    box(d, (58, 546, 1222, 662), "#1A2A46", radius=20)
    put(d, (82, 562), "JETZT WICHTIG", 15, CYAN, True)
    lines = wrap(d, cue_text, f(24, True), 1110)
    for n, line in enumerate(lines[:2]):
        put(d, (82, 589 + n * 30), line, 24, WHITE, True)
    d.rounded_rectangle((59, 690, 1221, 697), radius=3, fill="#29415E")
    d.rounded_rectangle((59, 690, 59 + int(1162 * (index + (cue_index + 1) / max(1, cue_total)) / 13), 697), radius=3, fill=CYAN)
    return im


def make_overview(index):
    previous = CHAPTERS[index]
    following = CHAPTERS[index + 1]
    im, d = base(index + 1, "Kurzüberblick", "Kapitelwechsel")
    box(d, (58, 236, 1222, 612), "#111E35", radius=28)
    put(d, (88, 264), "DAS NIMMST DU MIT", 18, CYAN, True)
    for i, label in enumerate(RECAPS[index]):
        y = 315 + i * 68
        box(d, (87, y, 695, y + 52), "#1A2D48", radius=14)
        put(d, (106, y + 9), f"{i + 1}.  {label}", 21, WHITE, True, 560)
    box(d, (748, 315, 1188, 520), "#1B3650", CYAN, 20)
    put(d, (775, 344), "ALS NÄCHSTES", 18, CYAN, True)
    put(d, (775, 389), following["title"], 28, WHITE, True, 380)
    put(d, (88, 556), "Ein Gedanke nach dem anderen.", 22, GOLD)
    return im


def seconds(stamp):
    h, m, rest = stamp.split(":")
    return int(h) * 3600 + int(m) * 60 + float(rest)


def stamp(value):
    n = round(value * 1000)
    h, n = divmod(n, 3600000)
    m, n = divmod(n, 60000)
    s, n = divmod(n, 1000)
    return f"{h:02}:{m:02}:{s:02}.{n:03}"


def cues_from_vtt():
    raw = (OUT / "einstieg-programmierung.vtt").read_text(encoding="utf-8")
    blocks = re.split(r"\n\s*\n", raw.replace("\r\n", "\n"))
    cues = []
    for block in blocks:
        match = re.search(r"(\d\d:\d\d:\d\d\.\d+)\s+-->\s+(\d\d:\d\d:\d\d\.\d+)\n(.+)", block, re.S)
        if match:
            cues.append((seconds(match[1]), seconds(match[2]), " ".join(match[3].split())))
    return cues


def render():
    old = json.loads((OUT / "einstieg-kapitel.json").read_text(encoding="utf-8"))
    starts = [c["start"] for c in old["chapters"]]
    ends = starts[1:] + [old["duration"]]
    cues = cues_from_vtt()
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    source = OUT / "einstieg-programmierung.mp4"
    with tempfile.TemporaryDirectory(prefix="codezone-neu-") as folder:
        tmp = Path(folder)
        wav = tmp / "source.wav"
        subprocess.run([ffmpeg, "-v", "error", "-y", "-i", str(source), "-vn", "-ar", "24000", "-ac", "1", "-c:a", "pcm_s16le", str(wav)], check=True)
        with wave.open(str(wav), "rb") as reader:
            audio = reader.readframes(reader.getnframes())
            rate = reader.getframerate()
        with wave.open(str(tmp / "new.wav"), "wb") as writer:
            writer.setnchannels(1); writer.setsampwidth(2); writer.setframerate(rate)
            for i, (start, end) in enumerate(zip(starts, ends)):
                writer.writeframes(audio[round(start * rate) * 2:round(end * rate) * 2])
                if i < 12:
                    writer.writeframes(b"\0\0" * round(GAP * rate))
        entries = []
        new_cues = ["WEBVTT", ""]
        new_chapters = []
        frame_no = 0
        for i, chapter in enumerate(CHAPTERS):
            start, end = starts[i], ends[i]
            shifted = start + i * GAP
            new_chapters.append({"id": chapter["id"], "title": chapter["title"], "start": round(shifted, 2)})
            selected = [c for c in cues if start <= c[0] < end]
            for j, (begin, cue_end, phrase) in enumerate(selected):
                next_begin = selected[j + 1][0] if j + 1 < len(selected) else end
                duration = max(0.08, next_begin - begin + (begin - start if j == 0 else 0))
                path = tmp / f"frame-{frame_no:04}.png"
                make_cue(chapter, i, phrase, j, len(selected)).save(path, optimize=True)
                entries.append((path, duration))
                frame_no += 1
                new_cues += [f"{stamp(begin + i * GAP)} --> {stamp(min(cue_end, end) + i * GAP)}", phrase, ""]
            if i < 12:
                path = tmp / f"frame-{frame_no:04}.png"
                make_overview(i).save(path, optimize=True)
                entries.append((path, GAP))
                frame_no += 1
            print(f"Bilder {i + 1}/13: {chapter['title']}", flush=True)
        concat = tmp / "frames.txt"
        concat.write_text("".join(f"file '{path.as_posix()}'\nduration {duration:.6f}\n" for path, duration in entries) + f"file '{entries[-1][0].as_posix()}'\n", encoding="utf-8")
        target = OUT / "einstieg-programmierung-neu.mp4"
        subprocess.run([ffmpeg, "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(concat), "-i", str(tmp / "new.wav"), "-fps_mode", "vfr", "-c:v", "libx264", "-preset", "veryfast", "-crf", "21", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-shortest", "-movflags", "+faststart", str(target)], check=True)
        (OUT / "einstieg-programmierung-neu.vtt").write_text("\n".join(new_cues), encoding="utf-8")
        (OUT / "einstieg-kapitel-neu.json").write_text(json.dumps({"duration": round(old["duration"] + 12 * GAP, 2), "chapters": new_chapters}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        make_cue(CHAPTERS[0], 0, "Eine Idee wird zu einer klaren, überprüfbaren Regel.", 0, 1).save(OUT / "einstieg-poster-neu.png", optimize=True)
        print(f"Fertig: {target} ({len(entries)} Bildabschnitte)", flush=True)


if __name__ == "__main__":
    render()
