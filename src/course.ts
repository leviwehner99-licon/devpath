export type CourseLesson = {
  id: string;
  title: string;
  objective: string;
  duration: number;
  language: "html" | "css";
  concepts: { tag: string; description: string }[];
  explanation: string;
  starterCode: string;
  task: string;
  successPattern: RegExp;
};

export const pilotCourse = {
  id: "first-responsive-site",
  version: "1.0.0",
  title: "Deine erste responsive Webseite",
  category: "Webentwicklung",
  lessons: [
    {
      id: "html-structure", title: "Eine Seite strukturieren", objective: "Du kannst Kopfbereich und Hauptinhalt mit passenden HTML-Elementen auszeichnen.", duration: 15, language: "html",
      concepts: [{ tag: "<header>", description: "Kopfbereich einer Seite oder eines Abschnitts." }, { tag: "<main>", description: "Der zentrale, einzigartige Inhalt der Seite." }, { tag: "<footer>", description: "Ergänzende Information am Ende der Seite oder eines Abschnitts." }],
      explanation: "HTML gibt den Inhalten einer Webseite Bedeutung. Semantische Elemente helfen Browsern und assistiven Technologien, die Struktur zu verstehen. Verwende <main> für den zentralen Seiteninhalt und normalerweise nur einmal pro Seite.",
      starterCode: "<!doctype html>\n<html lang=\"de\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <title>Meine Seite</title>\n  </head>\n  <body>\n    <header>\n      <h1>Mein Lernprojekt</h1>\n    </header>\n\n    <p>Hier beginnt meine Seite.</p>\n  </body>\n</html>\n",
      task: "Fasse den zentralen Inhalt in einem passenden main-Element zusammen.", successPattern: /<main(?:\s[^>]*)?>[\s\S]*?<\/main\s*>/i,
    },
    {
      id: "html-headings", title: "Inhalte mit Überschriften ordnen", objective: "Du kannst Überschriften in einer verständlichen Hierarchie einsetzen.", duration: 15, language: "html",
      concepts: [{ tag: "<h1>", description: "Die Hauptüberschrift der Seite." }, { tag: "<h2>", description: "Überschrift eines dazugehörigen Abschnitts." }, { tag: "<p>", description: "Ein Absatz mit zusammenhängendem Text." }],
      explanation: "Überschriften zeigen die inhaltliche Gliederung. Beginne mit einer Hauptüberschrift und nutze niedrigere Ebenen für Unterabschnitte. Wähle die Ebene nach der Bedeutung, nicht nach der gewünschten Schriftgröße.",
      starterCode: "<main>\n  <h1>Mein Hobby</h1>\n  <section>\n    <div>Hier kommt ein Abschnitt hin.</div>\n  </section>\n</main>\n",
      task: "Ergänze in einem Abschnitt eine h2-Überschrift und einen Absatz.", successPattern: /<section\b[\s\S]*?<h2\b[\s\S]*?<\/h2>[\s\S]*?<p\b[\s\S]*?<\/p>[\s\S]*?<\/section>/i,
    },
    {
      id: "html-links-images", title: "Links und Bilder ergänzen", objective: "Du kannst einen Link und ein verständlich beschriebenes Bild einfügen.", duration: 20, language: "html",
      concepts: [{ tag: "<a href>", description: "Ein Link mit einem klar benannten Ziel." }, { tag: "<img>", description: "Ein Bild; alt beschreibt seinen relevanten Inhalt." }, { tag: "rel=\"noopener\"", description: "Schützt bei Links, die in einem neuen Tab öffnen." }],
      explanation: "Links sollten erkennen lassen, wohin sie führen. Bilder bekommen einen Alternativtext, wenn sie Informationen vermitteln. Rein dekorative Bilder erhalten einen leeren alt-Text.",
      starterCode: "<main>\n  <h1>Meine Lieblingsorte</h1>\n  <p>Mehr über <a>meinen Verein</a>.</p>\n  <img src=\"park.jpg\">\n</main>\n",
      task: "Prüfe, ob der Link ein Ziel und das Bild einen passenden Alternativtext hat.", successPattern: /<a\b[^>]*href=[\"'][^\"']+[\"'][^>]*>[\s\S]*?<\/a>[\s\S]*?<img\b[^>]*alt=[\"'][^\"']*[\"'][^>]*>/i,
    },
    {
      id: "css-first-rules", title: "Mit CSS gestalten", objective: "Du kannst eine CSS-Regel mit Selektor und Eigenschaften schreiben.", duration: 15, language: "css",
      concepts: [{ tag: "Selektor", description: "Wählt die Elemente aus, die gestaltet werden." }, { tag: "Eigenschaft", description: "Legt fest, was sich ändert, etwa Farbe oder Schriftgröße." }, { tag: "Wert", description: "Bestimmt die konkrete Ausprägung einer Eigenschaft." }],
      explanation: "Eine CSS-Regel besteht aus einem Selektor und einer geschweiften Klammer. Darin stehen Deklarationen aus Eigenschaft und Wert. Semikolons trennen einzelne Deklarationen.",
      starterCode: "body {\n  font-family: system-ui, sans-serif;\n  color: #24233a;\n}\n\nmain {\n}\n",
      task: "Ergänze eine Regel für main mit einer Hintergrundfarbe und Innenabstand.", successPattern: /main\s*\{(?=[^}]*\bbackground(?:-color)?\s*:)(?=[^}]*\bpadding\s*:)[^}]*\}/i,
    },
    {
      id: "css-box-model", title: "Abstände und Boxmodell", objective: "Du kannst Außenabstand, Innenabstand und Rahmen gezielt unterscheiden.", duration: 20, language: "css",
      concepts: [{ tag: "padding", description: "Abstand zwischen Inhalt und Rahmen." }, { tag: "border", description: "Sichtbare Begrenzung der Box." }, { tag: "margin", description: "Abstand außerhalb der Box zu anderen Elementen." }],
      explanation: "Das Boxmodell besteht aus Inhalt, Innenabstand, Rahmen und Außenabstand. Mit box-sizing: border-box bleibt die angegebene Breite leichter nachvollziehbar.",
      starterCode: "* {\n  box-sizing: border-box;\n}\n\n.card {\n}\n",
      task: "Gestalte eine .card mit Innenabstand und abgerundeten Ecken.", successPattern: /\.card\s*\{(?=[^}]*\bpadding\s*:)(?=[^}]*\bborder-radius\s*:)[^}]*\}/i,
    },
    {
      id: "css-flexbox", title: "Elemente mit Flexbox anordnen", objective: "Du kannst Elemente mit Flexbox ausrichten und Abstand zwischen ihnen schaffen.", duration: 20, language: "css",
      concepts: [{ tag: "display: flex", description: "Ordnet direkte Kinder entlang einer Achse an." }, { tag: "gap", description: "Abstand zwischen Flex-Elementen." }, { tag: "align-items", description: "Ausrichtung quer zur Hauptachse." }],
      explanation: "Flexbox ist für eindimensionale Layouts praktisch: eine Zeile oder eine Spalte. Mit flex-wrap können Elemente bei wenig Platz in eine weitere Zeile wechseln.",
      starterCode: ".toolbar {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  flex-wrap: wrap;\n}\n",
      task: "Ergänze für .cards eine Flexbox-Regel mit Abstand und Umbruch.", successPattern: /\.cards\s*\{(?=[^}]*display\s*:\s*flex)(?=[^}]*gap\s*:)(?=[^}]*flex-wrap\s*:)[^}]*\}/i,
    },
    {
      id: "responsive-project", title: "Deine responsive Infoseite", objective: "Du kannst Inhalte strukturieren und mit CSS für schmale Bildschirme anpassen.", duration: 30, language: "html",
      concepts: [{ tag: "viewport", description: "Sorgt dafür, dass mobile Layoutbreiten korrekt interpretiert werden." }, { tag: "@media", description: "Wendet Regeln abhängig von der Darstellungsbreite an." }, { tag: "max-width", description: "Verhindert, dass ein Lesebereich zu breit wird." }],
      explanation: "Responsive Gestaltung passt sich an verfügbare Breite an. Beginne mit einer gut lesbaren schmalen Ansicht, setze flexible Breiten ein und ergänze größere Layouts mit Media Queries.",
      starterCode: "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n\n<main class=\"page\">\n  <h1>Über mich</h1>\n  <p>Ich lerne, Webseiten zu bauen.</p>\n</main>\n\n<style>\n.page {\n}\n</style>\n",
      task: "Baue eine Infoseite mit Hauptüberschrift, Abschnitt, Absatz und einer flexiblen Seitenbreite.", successPattern: /<main\b[\s\S]*?<h1\b[\s\S]*?<section\b[\s\S]*?<p\b[\s\S]*?<\/section>[\s\S]*?<\/main>/i,
    },
  ] satisfies CourseLesson[],
};

export const courseSkills = ["html-structure", "html-headings", "html-links-images", "css-first-rules", "css-box-model", "css-flexbox", "responsive-project"];
