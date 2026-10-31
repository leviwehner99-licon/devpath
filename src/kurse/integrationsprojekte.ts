import type { LessonBlueprint } from "./course-curriculum";

function integration(item: Omit<LessonBlueprint, "module" | "duration" | "practice" | "knowledgeCheck">): LessonBlueprint {
  return { ...item, module: "Systeme verbinden", duration: 45, practice: true };
}

export const integrationsprojekte: Record<string, LessonBlueprint> = {
  "web-development": integration({
    id: "frontend-integration", title: "Frontend als vollständigen Browserablauf verbinden", language: "typescript",
    objective: "Du verbindest Eingabe, React-Zustand, Datenabruf und sichtbare Fehlerbehandlung.",
    explanation: "Eine Browseranwendung braucht einen nachvollziehbaren Datenfluss. Das Eingabefeld ändert den Suchtext. Eine Funktion lädt Kursdaten von einer vorhandenen API oder einer lokalen Beispieldatei. Die Oberfläche zeigt Laden, Treffer, keine Treffer und Fehler getrennt. Der Browser entscheidet über die Darstellung; die API bleibt eine eigene Komponente, deren Servercode hier nicht geschrieben wird.",
    examples: [{ title: "Vier Zustände", language: "plaintext", code: "Eingabe → query\nquery + geladene Kurse → sichtbare Liste\nLaden → Hinweis\nFehler → erneut versuchen", note: "Jeder Zustand hat einen sichtbaren Text; ein leerer Bildschirm ist keine Fehlermeldung." }, { title: "Sicher laden", language: "typescript", code: "const response = await fetch('/courses.json');\nif (!response.ok) throw new Error('Kurse konnten nicht geladen werden');\nconst courses: unknown = await response.json();\n// Daten vor der Anzeige prüfen", note: "Eine JSON-Antwort ist zur Laufzeit zunächst unbekannt. Prüfe ihre Struktur vor der Verwendung." }],
    starterCode: "async function loadCourses() {\n  // Kursdaten laden, Status prüfen, Fehler behandeln\n}\n",
    task: "Baue im React-Projekt eine Suche mit Kursdaten aus courses.json. Zeige Laden, Treffer, Leerzustand und Fehler; prüfe alle vier Fälle im Browser.",
    successPattern: /fetch\s*\(|response\.ok|catch\s*\(/i,
    projectSteps: ["Kursdaten als lokale JSON-Datei bereitstellen.", "Daten laden und die Antwort prüfen.", "Suchtext mit Kursliste verbinden.", "Vier sichtbare Zustände im Browser testen."],
    acceptanceCriteria: ["Trefferliste reagiert auf den Suchtext.", "Leere Suche und keine Treffer sind unterscheidbar.", "Lade- und Fehlerzustand sind sichtbar.", "Nutzerdaten werden als Text statt als ungeprüftes HTML ausgegeben."],
    resources: [{ label: "MDN: Fetch und Antwortprüfung", url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch" }],
  }),
  backend: integration({
    id: "backend-integration", title: "Route, Regel und Datenbank zu einer API verbinden", language: "javascript",
    objective: "Du führst eine Anfrage über Validierung und Geschäftsregel zur Datenbank und zurück.",
    explanation: "Eine Route übersetzt HTTP in einen Fachvorgang. Sie prüft die Eingabe und ruft eine getrennte Regel auf. Die Regel entscheidet, ob ein Vorgang erlaubt ist; ein Repository kapselt die parametrisierte SQL-Abfrage. Die Route übersetzt Erfolg und Fehler in Statuscodes. Teste alle Schichten einzeln und danach den vollständigen Weg per HTTP.",
    examples: [{ title: "Getrennte Verantwortungen", language: "plaintext", code: "POST /tasks → Titel prüfen → Aufgabe anlegen\n                          ↓\n                      Repository → PostgreSQL\nAntwort ← 201 + Aufgabe oder 400 + Fehler", note: "Der Datenbankzugriff entscheidet nicht über den HTTP-Status; die Route übersetzt das Ergebnis." }, { title: "Parameter statt Textverkettung", language: "javascript", code: "const result = await pool.query(\n  'INSERT INTO tasks (title) VALUES ($1) RETURNING id, title',\n  [title.trim()]\n);", note: "Der Titel wird getrennt vom SQL-Text an PostgreSQL übergeben." }],
    starterCode: "app.post('/tasks', async (req, res) => {\n  // Eingabe prüfen, Regel aufrufen, Ergebnis übersetzen\n});\n",
    task: "Baue POST /tasks mit leerem und gültigem Titel. Speichere gültige Titel über eine parametrisierte Abfrage und prüfe 400, 201 und einen Datenbankfehler.",
    successPattern: /app\.post|pool\.query|\$1/i,
    projectSteps: ["API-Vertrag mit 201, 400 und Ausfallfall festlegen.", "Titel in der Route prüfen.", "Datenbankzugriff in eine eigene Funktion legen.", "HTTP-Test für alle drei Antworten ausführen."],
    acceptanceCriteria: ["Leerer Titel erreicht die Datenbank nicht.", "SQL-Werte werden als Parameter übergeben.", "Erfolg und Fehler haben unterschiedliche Statuscodes.", "Interne Datenbankfehler werden nicht an den Client geleakt."],
  }),
  ai: integration({
    id: "ai-integration", title: "Daten, Modell und Vorhersage-API verbinden", language: "python",
    objective: "Du verbindest ein geprüftes Modell mit einer lokalen FastAPI-Route und misst seine Grenzen.",
    explanation: "Die Datenaufbereitung erzeugt Eingaben und bekannte Zielwerte. Training verändert Modellparameter nur anhand des Trainingssatzes. Ein zurückgehaltener Test liefert eine Fehlertabelle; erst danach wird eine geprüfte Modellversion in der API verwendet. Die Route prüft Text, ruft das Modell auf und liefert Label sowie Version. Eine API-Antwort ist keine Garantie, dass die Vorhersage richtig ist.",
    examples: [{ title: "Zwei getrennte Abläufe", language: "plaintext", code: "Offline: Daten → Training → Test → freigegebene Version\nOnline: Eingabe → Prüfung → Modell → Antwort mit Version", note: "Trainiere nicht bei jeder Anfrage neu. Das Ergebnis der Prüfung gehört zur Modellfreigabe." }, { title: "Lokale Route", language: "python", code: "@app.post('/predict')\ndef predict(data: Input):\n    if not data.text.strip():\n        raise HTTPException(status_code=400, detail='Text fehlt')\n    label = model.predict([data.text])[0]\n    return {'label': str(label), 'model_version': version}", note: "Der Endpunkt verwendet ein zuvor geprüftes Modell und lehnt leere Eingaben ab." }],
    starterCode: "@app.post('/predict')\ndef predict(data: Input):\n    # Eingabe prüfen und freigegebenes Modell verwenden\n    pass\n",
    task: "Verbinde dein selbst trainiertes Modell mit /predict. Teste gültigen Text, leeren Text und zwei bekannte Fehlklassifikationen; dokumentiere die Modellversion.",
    successPattern: /@app\.post|model\.predict|model_version/i,
    projectSteps: ["Trainings- und Testdaten getrennt halten.", "Baseline und Modell am selben Test vergleichen.", "Geprüfte Version lokal in der API verwenden.", "Eingabe- und Fehlerfälle als API-Test ausführen."],
    acceptanceCriteria: ["Training findet nicht innerhalb einer Anfrage statt.", "API lehnt leere Eingaben ab.", "Antwort enthält eine Modellversion.", "Zwei Fehlerfälle und ihre Folgen sind dokumentiert."],
  }),
  "game-development": integration({
    id: "game-integration", title: "Szene, Eingabe und Spielregel verbinden", language: "gdscript",
    objective: "Du verbindest eine Godot-Szene, Spielersteuerung, Sammelobjekte und eine sichtbare Siegbedingung.",
    explanation: "Die Engine liest Eingaben und aktualisiert Szenen in kurzen Zeitschritten. Ein GDScript am Spieler übersetzt Eingaben in Bewegung. Sammelobjekte melden eine Berührung; eine Spielregel erhöht den Punktestand. Die Oberfläche zeigt den neuen Wert und meldet den Sieg an einer festgelegten Schwelle. Jede Verbindung ist im Szenenbaum und im laufenden Spiel überprüfbar.",
    examples: [{ title: "Signalfluss", language: "plaintext", code: "Taste → Spieler bewegt sich → Objekt berührt\nObjekt meldet collected → Spielregel +1\nPunktestand → Anzeige → Sieg bei Zielwert", note: "Ein Signal meldet ein Ereignis; die zentrale Spielregel entscheidet über Punkte und Sieg." }, { title: "Punkte als Regel", language: "gdscript", code: "func add_point() -> void:\n    score += 1\n    score_label.text = str(score)\n    if score >= target_score:\n        show_win_screen()", note: "Die Anzeige liest den aktuellen Zustand; die Gewinnschwelle wird an einer Stelle geprüft." }],
    starterCode: "func add_point() -> void:\n    # Punktestand, Anzeige und Sieg verbinden\n    pass\n",
    task: "Baue in Godot eine spielbare Szene mit Bewegung, drei Sammelobjekten, Punktestand und Siegmeldung. Prüfe Neustart und wiederholte Berührung.",
    successPattern: /score\s*\+=|score_label\.text|show_win_screen/i,
    projectSteps: ["Hauptszene und Spieler anlegen.", "Eingabe mit Bewegung verbinden.", "Sammelobjekt meldet Berührung an die Spielregel.", "Punktestand, Sieg und Neustart im laufenden Spiel testen."],
    acceptanceCriteria: ["Punkte steigen pro Sammelobjekt genau einmal.", "Anzeige und Spielzustand stimmen überein.", "Sieg tritt an der festgelegten Schwelle ein.", "Nach Neustart beginnt ein konsistenter Zustand."],
  }),
  security: integration({
    id: "security-integration", title: "Ein Websystem entlang seiner Grenzen absichern", language: "plaintext",
    objective: "Du prüfst in einem eigenen Labor Eingabe, Serverregel, Datenbank und Netzwerk getrennt.",
    explanation: "Eine Webanwendung hat mehrere Grenzen. Der Browser gibt fremden Text sicher aus. Der Server prüft Identität, Rechte und Eingaben. Die Datenbank erhält Werte als Parameter. Eine Firewall erlaubt nur benötigte Netzwerkverbindungen. Für jede Grenze formulierst du einen erlaubten und einen abgewiesenen Fall, prüfst die lokale Anwendung und wiederholst den Test nach einer Korrektur.",
    examples: [{ title: "Prüfmatrix", language: "plaintext", code: "Browser: fremder Text → als Text sichtbar\nServer: fremde Kurs-ID → Zugriff verweigert\nDatenbank: Eingabe → gebundener Parameter\nNetzwerk: Web-Port offen, DB-Port gesperrt", note: "Ein grüner Scan ersetzt keine Prüfung von Rechten und Fachregeln." }],
    starterCode: "Eigene Testanwendung: \nBrowser-Test: \nServer-Test: \nDatenbank-Test: \nFirewall-Test: \nKorrektur und erneuter Test: \n",
    task: "Erstelle für eine eigene lokale Anwendung eine Prüfmatrix. Führe je einen erlaubten und abgewiesenen Fall für Browser, API, Datenbank und Netzwerk aus und dokumentiere die Wiederholung nach einer Korrektur.",
    successPattern: /Browser-Test|Server-Test|Datenbank-Test|Firewall-Test/i,
    projectSteps: ["Eigene Testanwendung und erlaubten Umfang festlegen.", "Vier Systemgrenzen mit je zwei Fällen prüfen.", "Eine Schwachstelle gezielt beheben.", "Dieselben Fälle erneut ausführen und Ergebnisse vergleichen."],
    acceptanceCriteria: ["Nur eigene oder freigegebene Systeme werden geprüft.", "Erwartetes und tatsächliches Verhalten ist pro Grenze dokumentiert.", "Mindestens eine Korrektur ist erneut getestet.", "Scannerbefunde werden manuell eingeordnet."],
  }),
};
