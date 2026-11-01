# Animationsvideo zum Einstiegskurs

Das Video behandelt die 13 Lektionen von „Einstieg in die Programmierung“ in derselben Reihenfolge. Das redaktionelle Drehbuch steht in `video_einstieg_inhalte.py`; `video_einstieg_erstellen.py` erzeugt deutsche Sprecherstimme, Animation, Untertitel und Kapitelmarken. Die Grafik ist eine eigenständige CodeZone-Gestaltung.

Die aktive Neufassung wird mit `video_einstieg_neu.py` aus der vorhandenen Sprecheraufnahme und ihren VTT-Zeitmarken erstellt. Sie zeigt zu jedem Sprechabschnitt eine passende Karte und zwischen den 13 Kapiteln zwölf kurze Übersichten. Das ursprüngliche Video bleibt als Quelle erhalten. Die App verwendet die Dateien mit dem Suffix `-neu`.

Zum erneuten Erstellen unter Windows:

```powershell
python -m pip install -r skripte/video_anforderungen.txt
python skripte/video_einstieg_erstellen.py
python skripte/video_einstieg_neu.py
```

Die Sprachsynthese benötigt beim Rendern eine Internetverbindung und sendet den redaktionellen Sprechertext an den Sprachdienst. Die fertige MP4-Datei in `public/videos/` spielt danach lokal ohne diesen Dienst. Die Videoerstellung ist unabhängig vom normalen App-Build.
