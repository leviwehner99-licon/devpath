# Animationsvideo zum Einstiegskurs

Das Video behandelt die 13 Lektionen von „Einstieg in die Programmierung“ in derselben Reihenfolge. Das redaktionelle Drehbuch steht in `video_einstieg_inhalte.py`; `video_einstieg_erstellen.py` erzeugt deutsche Sprecherstimme, Animation, Untertitel und Kapitelmarken. Die Grafik ist eine eigenständige CodeZone-Gestaltung.

Die vorherige Neufassung wird mit `video_einstieg_neu.py` aus der vorhandenen Sprecheraufnahme und ihren VTT-Zeitmarken erstellt. Sie zeigt zu jedem Sprechabschnitt eine passende Karte und zwischen den 13 Kapiteln zwölf kurze Übersichten. Das ursprüngliche Video bleibt als Quelle erhalten. Diese Zwischenfassung trägt das Suffix `-neu`.

Die aktuelle Kursfassung ist `public/videos/einstieg-programmierung-visual.mp4` (16:07 Minuten). Ihre Basis ist eine private Descript-Videokopie in `skripte/video-quelle/einstieg-descript-kopie.mp4`. Der Descript-Timeline-Export war im aktuellen Tarif nicht verfügbar; die Descript-Grafiken sind in dieser Kopie daher als Bildspur enthalten. `video_einstieg_offline_finalisieren.py` ergänzt Kapitel 13 mit sieben separaten Pillow-Grafiken. `video_einstieg_beispiele_montieren.py` ergänzt an den Sprecherstellen 02:33 und 07:35 anschauliche Beispiele aus [Canva](https://canva.link/3nvxculhbi9h8yl) und [Figma](https://www.figma.com/board/Dz89gdgYjE1tKMsPDoGrae). Beide Originaldateien sind editierbar; ihre exportierten Bildfassungen liegen unter `skripte/video-quelle/assets/`. Der Schnitt erfolgt mit FFmpeg, weil die verbundene Canva-Schnittstelle keinen Video-Timeline-Export oder Schnittaufruf bereitstellt. Die App verwendet die neue MP4 sowie die vorhandenen `-final`-Kapitelmarken, Untertitel und das Poster.

Für die Sprachsynchronisierung wurde die 16:07-Minuten-Sprecheraufnahme in [ElevenLabs](https://elevenlabs.io/app/flows/9hXe3DRRXaOEzm9CAI6U) hochgeladen und ein Scribe-Lauf mit Wortzeitmarken vorbereitet. Der Dienst wies den Lauf wegen ausgelasteter kostenloser Kapazität ab; es wurden keine Credits berechnet. Die neuen Bildfenster sind anhand der bereits vorhandenen VTT-Sprechzeitmarken gesetzt. Eine bestätigte ElevenLabs-Wortsynchronisierung ist deshalb noch ausstehend.

Zum erneuten Erstellen unter Windows:

```powershell
python -m pip install -r skripte/video_anforderungen.txt
python skripte/video_einstieg_erstellen.py
python skripte/video_einstieg_neu.py
python skripte/video_einstieg_offline_finalisieren.py
python skripte/video_einstieg_beispiele_montieren.py
```

Die Sprachsynthese benötigt beim Rendern eine Internetverbindung und sendet den redaktionellen Sprechertext an den Sprachdienst. Die fertige MP4-Datei in `public/videos/` spielt danach lokal ohne diesen Dienst. Die Videoerstellung ist unabhängig vom normalen App-Build.
