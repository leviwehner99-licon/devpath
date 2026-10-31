# Animationsvideo zum Einstiegskurs

Das Video behandelt die 13 Lektionen von „Einstieg in die Programmierung“ in derselben Reihenfolge. Das redaktionelle Drehbuch steht in `video_einstieg_inhalte.py`; `video_einstieg_erstellen.py` erzeugt deutsche Sprecherstimme, Animation, Untertitel und Kapitelmarken. Die Grafik ist eine eigenständige CodeZone-Gestaltung.

Zum erneuten Erstellen unter Windows:

```powershell
python -m pip install -r skripte/video_anforderungen.txt
python skripte/video_einstieg_erstellen.py
```

Die Sprachsynthese benötigt beim Rendern eine Internetverbindung und sendet den redaktionellen Sprechertext an den Sprachdienst. Die fertige MP4-Datei in `public/videos/` spielt danach lokal ohne diesen Dienst. Die Videoerstellung ist unabhängig vom normalen App-Build.
