"""Montiert Canva- und Figma-Beispiele über das bestehende Einstiegsvideo.

Die eingebrannte Untertitelzone ab y=562 und die Original-Tonspur bleiben erhalten.
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / ".video-tools"))
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

VIDEO = ROOT / "public/videos/einstieg-programmierung-final.mp4"
ASSETS = ROOT / "skripte/video-quelle/assets"
FONT = Path("C:/Windows/Fonts/segoeuib.ttf")
W, H = 1280, 720


def scene(title: str, subtitle: str, picture: Image.Image) -> Image.Image:
    image = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, W, 562), fill="#0C1C3A")
    draw.text((60, 31), "CODEZONE  /  EINSTIEG IN DIE PROGRAMMIERUNG", font=ImageFont.truetype(str(FONT), 17), fill="#45D9E8")
    draw.text((60, 69), title, font=ImageFont.truetype(str(FONT), 36), fill="#F7FAFF")
    draw.text((60, 506), subtitle, font=ImageFont.truetype(str(FONT), 23), fill="#FF9F42")
    box = Image.new("RGBA", (1160, 360), "#F7FAFF")
    fitted = picture.convert("RGB")
    fitted.thumbnail((1120, 320), Image.Resampling.LANCZOS)
    box.paste(fitted, ((1160 - fitted.width) // 2, (360 - fitted.height) // 2))
    image.alpha_composite(box, (60, 133))
    draw.rounded_rectangle((60, 133, 1220, 493), radius=16, outline="#45D9E8", width=3)
    return image


def main() -> None:
    canva = Image.open(ASSETS / "canva-kurssuche.png").convert("RGB")
    figma = Image.open(ASSETS / "figma-kurssuche.png").convert("RGB")
    pictures = [
        ("DREI SCHRITTE EINER KURSSUCHE", "Eingabe → Regel → Ergebnis", canva.crop((0, 0, canva.width, 250))),
        ("BEISPIEL: SPIEL SUCHEN", "Eingabe vorbereiten, Regel anwenden", figma.crop((0, 0, 590, figma.height))),
        ("AUCH ANDERE FÄLLE PRÜFEN", "Treffer oder verständliche Rückmeldung", figma.crop((505, 0, figma.width, figma.height))),
    ]
    paths = []
    for index, (title, subtitle, picture) in enumerate(pictures, 1):
        path = ASSETS / f"beispiel-{index:02}.png"
        scene(title, subtitle, picture).save(path, optimize=True)
        paths.append(path)

    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    output = VIDEO.with_name("einstieg-programmierung-visual.mp4")
    command = [ffmpeg, "-v", "error", "-y", "-i", str(VIDEO)]
    for path in paths:
        command.extend(["-i", str(path)])
    ranges = [(153.25, 170.58), (455.76, 462.44), (462.44, 471.49)]
    chain = "[0:v]format=yuv420p[v0];"
    for index, (start, end) in enumerate(ranges, 1):
        chain += f"[v{index - 1}][{index}:v]overlay=x=0:y=0:eof_action=repeat:enable='between(t,{start},{end})'[v{index}];"
    command += ["-filter_complex", chain.rstrip(";"), "-map", "[v3]", "-map", "0:a:0", "-c:v", "libx264", "-preset", "veryfast", "-crf", "21", "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", str(output)]
    subprocess.run(command, check=True)
    print(f"Montiert: {output} ({output.stat().st_size / 1_000_000:.1f} MB)")


if __name__ == "__main__":
    main()
