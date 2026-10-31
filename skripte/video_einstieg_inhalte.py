"""Redaktionelles Drehbuch für das Kursvideo 'Einstieg in die Programmierung'."""

CHAPTERS = [
    {
        "id": "program-output", "title": "Was Programmierung wirklich ist",
        "voice": """Was passiert eigentlich, wenn wir programmieren? Wir übersetzen eine Absicht in einen Ablauf, den ein Computer eindeutig ausführen kann. Das klingt abstrakt, wird aber mit einem Beispiel klar. Stell dir vor, eine Lernende sucht in einer langen Kursliste nach Webentwicklung. Sie tippt Web ein. Das Programm liest dieses Wort, vergleicht es mit den Kurstiteln und zeigt passende Treffer. Die Idee allein reicht noch nicht: Wir müssen festlegen, was bei einem Treffer und was ohne Treffer passieren soll. Quellcode ist die aufgeschriebene Form dieser Regeln. Ein laufendes Programm führt sie aus. Und ein Test prüft, ob das Ergebnis wirklich zur Aufgabe passt. Programmieren bedeutet also nicht, möglichst viele Befehle zu kennen. Es bedeutet, ein Problem zu verstehen, eine präzise Regel zu bauen und ihre Wirkung zu überprüfen. Diesen gesamten Weg werden wir im Video an derselben Kurssuche verfolgen.""",
        "slides": [
            ("Eine Absicht wird ausführbar", ["Problem", "klare Regel", "laufendes Programm"], "Eine Idee braucht überprüfbare Schritte."),
            ("Unser Beispiel: Kurse finden", ["Suchwort: Web", "Titel vergleichen", "Treffer anzeigen"], "Die gleiche Regel behandelt jede Anfrage."),
            ("Woran erkennen wir Erfolg?", ["Web → Treffer", "xyz → Hinweis", "beide Fälle testen"], "Erst der Test zeigt, ob die Lösung trägt."),
        ],
    },
    {
        "id": "program-why", "title": "Welches Problem lösen wir?",
        "voice": """Bevor wir eine Funktion planen, sollten wir wissen, wem sie hilft. Unsere Lernende hat wenig Zeit und eine lange Kursliste vor sich. Ihr Ziel ist nicht, eine besonders aufwendige Webseite zu benutzen. Sie möchte einen passenden Kurs finden. Deshalb beginnen wir mit einem kleinen, prüfbaren Nutzen: Sie gibt einen Begriff ein und sieht relevante Kurse. Eine riesige Liste möglicher Funktionen würde uns an dieser Stelle eher ablenken. Vielleicht wären Empfehlungen, Konten und Bewertungen irgendwann sinnvoll. Für die erste Version brauchen wir sie nicht. Der Unterschied ist wichtig: Ein Funktionswunsch beschreibt, was die Software vielleicht hat. Ein Nutzerziel beschreibt, was eine Person damit erreichen kann. Wir können sogar prüfen, ob unsere erste Version hilft: Das Wort Spiel soll Spieleentwicklung auffindbar machen. Eine Person soll danach erkennen, wohin sie klicken kann. Wenn wir Ziel und Erfolg so konkret formulieren, können wir die Technik später passend auswählen.""",
        "slides": [
            ("Zuerst der Mensch", ["Lernende", "wenig Zeit", "passenden Kurs finden"], "Ein Ziel ist konkreter als eine lange Funktionsliste."),
            ("Die erste sinnvolle Version", ["Kursliste", "Suchfeld", "sichtbarer Treffer"], "Klein anfangen macht das Ergebnis prüfbar."),
            ("Erfolg sichtbar machen", ["Eingabe: Spiel", "Spieleentwicklung", "Kurs öffnen"], "Ein echter Nutzerweg ist unser Maßstab."),
        ],
    },
    {
        "id": "program-input-result", "title": "Eingabe, Verarbeitung, Ergebnis",
        "voice": """Fast jedes Programm lässt sich zunächst als Weg von einer Eingabe zu einem Ergebnis betrachten. Bei der Kurssuche ist die Eingabe das Suchwort. Außerdem braucht die Suche eine vorhandene Liste von Kursen. Die Verarbeitung ist die Regel, die das Wort mit jedem Titel vergleicht. Das Ergebnis ist eine neue Liste mit passenden Kursen. Diese drei Teile sollten wir sauber trennen. Sonst wissen wir bei einem Fehler kaum, ob die Eingabe falsch gelesen, die Regel falsch angewendet oder das Ergebnis falsch angezeigt wurde. Nehmen wir Web als Suchwort und die Titel Webentwicklung, Spieleentwicklung und Python. Die Regel findet Webentwicklung. Der Bildschirm zeigt diesen Kurs. Bei der Eingabe xyz ist die Trefferliste leer. Auch das ist ein gültiges Ergebnis, das die Oberfläche erklären muss. Wenn du ein neues Programm entwirfst, zeichne zuerst diese drei Stationen. Danach lässt sich jeder Schritt einzeln prüfen.""",
        "slides": [
            ("Ein Programm als Datenfluss", ["Eingabe", "Verarbeitung", "Ergebnis"], "Drei Stationen, die wir einzeln prüfen können."),
            ("Suche nach Web", ["Web + Kursliste", "Titel vergleichen", "Webentwicklung"], "Die Regel wählt aus vorhandenen Daten aus."),
            ("Auch leer ist ein Ergebnis", ["xyz", "kein Titel passt", "Hinweis zeigen"], "Eine verständliche Antwort ist besser als eine leere Fläche."),
        ],
    },
    {
        "id": "program-order", "title": "Abläufe und Zustände",
        "voice": """Jetzt ordnen wir die Schritte. Ein Ablauf beschreibt, was nacheinander geschieht. Ein Zustand beschreibt, welche Werte gerade gelten. In unserer Suche ist das aktuelle Suchwort ein Zustand. Wenn die Lernende Web eintippt, liest die Anwendung zuerst diesen Wert. Dann vergleicht sie die Kurstitel. Erst danach kann sie Treffer anzeigen. Würde sie die Anzeige vor dem Vergleich aktualisieren, hätte sie noch kein neues Ergebnis. Ändert die Lernende Web zu Spiel, beginnt derselbe Ablauf erneut, aber mit einem anderen Zustand. Der Ablauf bleibt also gleich, während sich die Daten ändern. Diese Unterscheidung hilft später bei Formularen, Spielen und Apps. Ein Spielfigur-Zustand kann zum Beispiel ihre Position sein; ein Ablauf liest eine Taste, berechnet eine neue Position und zeichnet sie. Frage dich bei jeder Planung: Welche Information muss bereits vorliegen, bevor der nächste Schritt ausgeführt werden kann?""",
        "slides": [
            ("Reihenfolge schafft Klarheit", ["Suchwort lesen", "Treffer berechnen", "Anzeige ändern"], "Jeder Schritt braucht das Ergebnis des vorigen."),
            ("Zustand: das aktuelle Wort", ["Web", "Eingabe ändert sich", "Spiel"], "Der Ablauf bleibt, die Werte wechseln."),
            ("Warum nicht andersherum?", ["Anzeige zuerst?", "noch keine Treffer", "falscher Zustand"], "Daten müssen vor ihrer Darstellung berechnet werden."),
        ],
    },
    {
        "id": "program-decisions", "title": "Entscheidungen und Randfälle",
        "voice": """Eine Bedingung ist eine Frage, auf die das Programm mit ja oder nein antwortet. Bei der Suche lautet sie: Enthält dieser Kurstitel das Suchwort? Bei ja nehmen wir den Kurs in die Trefferliste auf. Bei nein lassen wir ihn aus. Doch eine gute Lösung plant mehr als den glücklichen Fall. Was passiert bei einem leeren Suchfeld? Was bei einem Wort, zu dem kein Kurs passt? Solche Randfälle sind keine Nebensache. Sie gehören zum normalen Verhalten einer Anwendung. Für eine leere Suche könnten wir alle Kurse anzeigen. Wenn kein Titel passt, zeigen wir den Hinweis Keine Kurse gefunden und bieten einen Weg zurück zur Suche. Wichtig ist, dass die Regel eindeutig bleibt. Wenn wir stattdessen einen zufälligen Kurs zeigen, wirkt die Anwendung unzuverlässig. Zeichne für jede wichtige Bedingung beide Wege. Dann kannst du beide Wege gezielt testen.""",
        "slides": [
            ("Eine Frage, zwei Wege", ["Titel passt?", "Ja → anzeigen", "Nein → auslassen"], "Jede Verzweigung braucht eine klare Regel."),
            ("Der Fall ohne Treffer", ["Suchwort: xyz", "Trefferliste leer", "Hinweis + Rückweg"], "Leere Ergebnisse werden bewusst gestaltet."),
            ("Der leere Suchtext", ["Eingabe leer", "alle Kurse?", "Regel festlegen"], "Randfälle sind Teil des Produkts."),
        ],
    },
    {
        "id": "program-repeat", "title": "Wiederholung und Zerlegung",
        "voice": """Unsere Liste enthält nicht nur einen Kurs. Die gleiche Frage muss für jeden Titel gestellt werden. Dafür verwenden Programme eine Schleife: Sie wiederholt einen Schritt für mehrere Werte. Zuerst prüft die Suche Webentwicklung, dann Spieleentwicklung und schließlich Python. Jedes Mal gilt dieselbe Regel; nur der gerade untersuchte Titel ändert sich. Wenn die Liste später tausend Kurse enthält, müssen wir die Regel trotzdem nur einmal formulieren. Eine Funktion bündelt diese Regel unter einem Namen. Man kann sich die Funktion als klar benannten Teil des Ablaufs vorstellen: Gib ihr Suchwort und Titel, und sie liefert zurück, ob sie zusammenpassen. Das ist keine Magie, sondern eine Möglichkeit, große Aufgaben in kleinere prüfbare Teile zu zerlegen. Wir können die Vergleichsregel zunächst mit einem Titel testen und danach mit der Schleife auf die ganze Liste anwenden. So wächst die Lösung, ohne unübersichtlich zu werden.""",
        "slides": [
            ("Eine Regel für viele Titel", ["Kurs 1 prüfen", "Kurs 2 prüfen", "Kurs 3 prüfen"], "Eine Schleife wiederholt denselben Schritt."),
            ("Die Regel bekommt einen Namen", ["Suchwort + Titel", "passt der Titel?", "Ja oder Nein"], "Eine Funktion kapselt einen klaren Teil der Arbeit."),
            ("Erst klein testen", ["ein Titel", "drei Titel", "viele Titel"], "Zerlegung hält die Lösung verständlich."),
        ],
    },
    {
        "id": "program-search-workshop", "title": "Die Kurssuche selbst entwerfen",
        "voice": """Du kannst die Suche jetzt ohne Programmiersprache entwerfen. Nimm drei Kurstitel, zum Beispiel Webentwicklung, Spieleentwicklung und Python. Entscheide zuerst ganz genau, wann ein Titel als Treffer zählt. Eine brauchbare Regel könnte lauten: Das Suchwort muss irgendwo im Titel vorkommen, unabhängig von Groß- und Kleinschreibung. Nun probieren wir zwei Eingaben aus. Bei Spiel findet die Regel Spieleentwicklung. Bei xyz findet sie nichts. Schreibe für beide Fälle das erwartete Ergebnis auf, bevor du die Regel ausführst. Danach gehst du jeden Titel nacheinander durch und wendest dieselbe Regel an. Du bemerkst vielleicht eine offene Frage: Was soll bei leerem Suchwort passieren? Auch dafür musst du eine Entscheidung treffen. Genau so sieht praktische Programmplanung aus. Man beginnt mit Daten, legt eine eindeutige Regel fest und prüft sie an mehreren Fällen. Halte das Video gern kurz an und versuche es mit drei eigenen Titeln.""",
        "slides": [
            ("Deine drei Testdaten", ["Webentwicklung", "Spieleentwicklung", "Python"], "Nimm anschließend eigene Kurstitel."),
            ("Formuliere die Regel", ["Suchwort im Titel?", "Großschreibung egal", "Treffer sammeln"], "Eine Regel muss für jeden Titel gleich gelten."),
            ("Zwei Prüfungen", ["Spiel → Treffer", "xyz → kein Treffer", "Leerfall erklären"], "Halte hier an und entwirf deine Variante."),
        ],
    },
    {
        "id": "program-debug", "title": "Fehler systematisch finden",
        "voice": """Unsere erste Suche hat einen Fehler. Die Eingabe Spiel sollte den Kurs Spieleentwicklung finden. Tatsächlich erscheint kein Treffer. Statt jetzt beliebig etwas zu ändern, trennen wir drei Dinge. Erstens die Erwartung: Spieleentwicklung soll sichtbar sein. Zweitens die Beobachtung: Die Liste bleibt leer. Drittens eine Vermutung über die Ursache: Vielleicht vergleicht die Regel beide Wörter nur auf exakte Gleichheit. Dann sind Spiel und Spieleentwicklung verschieden, und der Fehler wird verständlich. Diese Vermutung können wir prüfen. Wir sehen uns die Vergleichsregel an und testen sie mit genau diesen beiden Werten. Erst wenn die Vermutung passt, ändern wir eine Sache. Statt gleicher Wörter erlauben wir, dass der Titel das Suchwort enthält. Danach wiederholen wir denselben Test. Debuggen bedeutet also, eine Ursache mit Beobachtungen einzugrenzen, nicht auf gut Glück Code umzubauen. Die gleiche Methode hilft bei jeder späteren Anwendung.""",
        "slides": [
            ("Ein konkreter Fehler", ["Eingabe: Spiel", "erwartet: Spiele", "beobachtet: leer"], "Erwartung und Beobachtung getrennt notieren."),
            ("Eine prüfbare Vermutung", ["exakte Gleichheit?", "Spiel ≠ Spiele", "Ursache gefunden?"], "Die Vermutung muss einen Test erlauben."),
            ("Nur eine Sache ändern", ["Titel enthält Wort", "gleichen Fall prüfen", "Nachbarfall testen"], "Ein Fix zählt erst mit erneutem Test."),
        ],
    },
    {
        "id": "program-debug-workshop", "title": "Die Suchregel verbessern",
        "voice": """Wir führen die Fehlersuche jetzt vollständig durch. Ausgangspunkt ist die Eingabe Spiel und der Kurstitel Spiele. Erwartet wird ein Treffer, beobachtet wird keiner. Die alte Regel verlangt, dass Suchwort und Titel exakt gleich sind. Das erklärt die Beobachtung. Wir ersetzen sie durch die Regel: Der Titel enthält das Suchwort. Nun prüfen wir Spiel gegen Spiele erneut und erhalten einen Treffer. Aber damit sind wir noch nicht fertig. Wir testen auch ein Wort, das nicht im Titel vorkommt, zum Beispiel Web. Dieser Test darf Spiele nicht anzeigen. Zusätzlich überlegen wir, ob Groß- und Kleinschreibung die Suche beeinflussen soll. Wenn nicht, vergleichen wir beide Texte in derselben Schreibweise. So verhindern wir, dass eine Korrektur einen neuen Fehler schafft. Das Muster ist immer gleich: Fall festhalten, Ursache vermuten, genau eine Änderung vornehmen und ursprünglichen sowie benachbarten Fall prüfen. Versuche danach, diese fünf Schritte ohne Hilfe zu erklären.""",
        "slides": [
            ("Der ursprüngliche Fall", ["Spiel", "Spiele", "noch kein Treffer"], "Wir halten denselben Testfall fest."),
            ("Eine gezielte Änderung", ["exakt gleich", "→ enthält Wort", "Spiel findet Spiele"], "Nur die Vergleichsregel wird geändert."),
            ("Nebenwirkungen prüfen", ["Web findet Spiele?", "Nein", "Großschreibung prüfen"], "Ein guter Fix besteht mehrere Fälle."),
        ],
    },
    {
        "id": "program-ecosystem", "title": "Sprache, Laufzeit und Werkzeuge",
        "voice": """Bisher haben wir Regeln beschrieben, ohne uns auf eine Programmiersprache festzulegen. Jetzt ordnen wir die Bausteine eines Softwareprojekts. Eine Programmiersprache legt fest, wie wir Regeln schreiben. JavaScript ist zum Beispiel eine solche Sprache. Eine Laufzeit führt geschriebenen Code aus. Im Browser kann JavaScript auf einer Webseite laufen; Node.js führt JavaScript außerhalb des Browsers aus. Eine Bibliothek stellt fertige Funktionen für bestimmte Aufgaben bereit. Ein Framework gibt zusätzlich eine Projektstruktur oder typische Abläufe vor. Werkzeuge helfen uns beim Schreiben, Starten und Prüfen. Ein Editor ist ein Werkzeug; ein Paketmanager lädt Bibliotheken in ein Projekt. Diese Wörter werden oft durcheinandergeworfen. Darum eine klare Frage: Erfüllt ein Baustein die Regeln, führt er sie aus, liefert er fertige Teile oder hilft er nur beim Entwickeln? Nicht jedes Projekt braucht jedes Werkzeug. Wähle sie erst, wenn die Aufgabe klar ist.""",
        "slides": [
            ("Vier verschiedene Rollen", ["Sprache", "Laufzeit", "Bibliothek / Framework"], "Werkzeuge unterstützen alle Schritte."),
            ("Beispiel im Browser", ["JavaScript: Sprache", "Browser: Laufzeit", "Editor: Werkzeug"], "Die Begriffe sind keine Synonyme."),
            ("Erst Aufgabe, dann Werkzeug", ["Problem verstehen", "Bedarf erkennen", "Technik auswählen"], "Mehr Technik macht ein Projekt nicht automatisch besser."),
        ],
    },
    {
        "id": "program-languages", "title": "Welche Sprache passt zum Ziel?",
        "voice": """Es gibt keine eine beste Programmiersprache für alle Aufgaben. Für eine Oberfläche im Browser arbeiten mehrere Technologien zusammen. HTML ordnet Inhalte und ist eine Auszeichnungssprache. CSS gestaltet diese Inhalte. JavaScript steuert das Verhalten; TypeScript ergänzt JavaScript um eine Prüfung von Datentypen während der Entwicklung. Auf einem Server werden häufig Java, C Sharp, Python oder PHP verwendet. SQL fragt Tabellen einer Datenbank ab und verändert deren Daten. Für Datenanalyse und maschinelles Lernen ist Python verbreitet. C, C Plus Plus und Rust sind wichtig, wenn Leistung, Speicher und Hardware eine große Rolle spielen. Kotlin wird oft für Android, Swift für Apple-Apps und G D Script für Spiele mit Godot eingesetzt. Diese Zuordnung ist eine Orientierung, kein starres Gesetz. In echten Projekten zählen auch vorhandene Systeme und Erfahrung im Team. Wenn du weißt, was du bauen willst, kannst du die passenden Sprachen gezielt lernen, statt alle gleichzeitig anzufangen.""",
        "slides": [
            ("Browseroberfläche", ["HTML: Struktur", "CSS: Gestaltung", "JavaScript: Verhalten"], "TypeScript prüft JavaScript-Code vor dem Start."),
            ("Server und Daten", ["Java / C# / Python / PHP", "Regeln auf dem Server", "SQL: Tabellen"], "Die Sprache folgt auch dem vorhandenen System."),
            ("Apps, Spiele, Systeme", ["Kotlin / Swift", "GDScript", "C / C++ / Rust"], "Wähle nach Ziel, Plattform und Team."),
        ],
    },
    {
        "id": "program-system", "title": "Wie entsteht ein ganzes System?",
        "voice": """Zum Schluss setzen wir die Teile zusammen. Eine Lernende klickt im Browser auf Favorit. Die Oberfläche reagiert zunächst sichtbar und schickt eine Anfrage an einen Server. Der Server prüft: Ist die Person angemeldet? Gibt es diesen Kurs? Darf sie diesen Favoriten verändern? Erst dann speichert er die Information in einer Datenbank. Die Datenbank hält den Wert dauerhaft fest. Der Server sendet eine Antwort zurück, und die Oberfläche zeigt Erfolg oder einen verständlichen Fehler. Jeder Teil hat eine eigene Verantwortung. Der Browser darf eine hübsche Meldung anzeigen, aber er sollte nicht allein über Zugriffsrechte entscheiden. Der Server muss die Regeln selbst durchsetzen. Nicht jede kleine Webseite braucht einen eigenen Server und eine Datenbank. Für einen einfachen statischen Kursfinder könnten Dateien im Browser genügen. Wenn aber persönliche Favoriten gespeichert werden sollen, brauchen wir einen verlässlichen Speicherweg. So hilft uns die Architektur, die richtige Größe einer Lösung zu wählen.""",
        "slides": [
            ("Ein Klick löst einen Weg aus", ["Browser", "Anfrage", "Server"], "Die Oberfläche nimmt eine Absicht entgegen."),
            ("Regeln vor dem Speichern", ["Anmeldung prüfen", "Kurs prüfen", "Datenbank ändern"], "Rechte werden auf dem Server geprüft."),
            ("Eine sichtbare Antwort", ["Server antwortet", "Erfolg / Fehler", "Browser zeigt Zustand"], "Jeder Baustein hat eine klare Verantwortung."),
        ],
    },
    {
        "id": "program-learning", "title": "Dein nächster Lernweg",
        "voice": """Du hast jetzt den Weg von einer Idee zu einem prüfbaren Programm gesehen. Du brauchst zum Weiterlernen nicht sofort zehn Sprachen oder ein großes Framework. Wähle ein Thema, das dich wirklich interessiert. Wenn du Webseiten magst, baue einen kleinen Kursfinder im Browser. Wenn du Spiele magst, lass eine Figur auf eine Eingabe reagieren. Wenn du Daten spannend findest, ordne und untersuche eine kleine Liste. Formuliere für dein erstes Projekt einen sichtbaren Erfolg und einen Fehlerfall. Baue dann eine kleine lauffähige Version, prüfe beide Fälle und verbessere einen gefundenen Fehler. Wenn du etwas nicht verstehst, erkläre den Ablauf laut in eigenen Worten und probiere ein kleineres Beispiel. Der passende Themenkurs führt dich an der richtigen Stelle zu einer Programmiersprache und zu Werkzeugen. Entscheidend ist, dass du immer wieder selbst etwas baust und prüfst. Halte zum Abschluss dieses Videos fest: Welches Problem möchtest du als Erstes lösen, und woran würdest du erkennen, dass deine Lösung funktioniert?""",
        "slides": [
            ("Wähle ein eigenes Ziel", ["Website", "Spiel", "Datenprojekt"], "Interesse ist ein guter Startpunkt."),
            ("Lerne in kleinen Zyklen", ["kleine Version", "Normal- und Fehlerfall", "gezielt verbessern"], "Bauen und Prüfen gehören zusammen."),
            ("Dein erster Schritt", ["Problem notieren", "Erfolg definieren", "Projekt beginnen"], "Jetzt bist du dran."),
        ],
    },
]
