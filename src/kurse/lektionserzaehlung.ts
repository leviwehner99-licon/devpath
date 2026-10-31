import type { CourseLesson } from "./course";

const openings: Record<string, string[]> = {
  "programming-intro": ["Bevor wir ins Detail gehen, schauen wir auf den Gedanken hinter dem Programmieren.", "Hier geht es darum, eine Idee in klare, überprüfbare Schritte zu übersetzen."],
  "web-development": ["Stell dir die Seite aus Sicht eines Menschen vor, der gerade etwas erledigen möchte.", "Eine gute Oberfläche verbindet Inhalt, Gestaltung und Verhalten zu einem verständlichen Weg."],
  backend: ["Hinter einer sichtbaren Oberfläche arbeitet ein System, das Anfragen und Daten zuverlässig behandeln muss.", "Verfolge gedanklich eine Anfrage vom Eingang bis zur Antwort."],
  security: ["Betrachte das System diesmal aus der Sicht einer Person, die eine Grenze überschreiten könnte.", "Sicherheit wird greifbar, wenn du Eingang, mögliche Wirkung und Schutz gemeinsam prüfst."],
  ai: ["Bei einem lernenden System zählt nicht nur die Vorhersage, sondern auch, woher sie kommt und wie gut sie geprüft wurde.", "Verfolge den Weg von den Daten über das Modell bis zur Entscheidung."],
  "game-development": ["Ein Spiel entsteht aus wiederholten Entscheidungen des Programms und verständlicher Rückmeldung an den Spieler.", "Denk an einen einzigen Spielmoment: Eingabe, Regel, Zustand und sichtbare Reaktion."],
  career: ["Im Berufsalltag zählt, ob andere deine Entscheidungen und Ergebnisse nachvollziehen können.", "Nimm eine echte kleine Aufgabe als Maßstab, statt nur über Schlagwörter nachzudenken."],
};

const authored: Record<string, string> = {
  "program-output": "Programmierung bedeutet, einem Computer einen Ablauf so genau zu beschreiben, dass er ihn wiederholt ausführen kann. Das beginnt nicht mit einer bestimmten Sprache. Zuerst brauchst du eine Frage: Was soll passieren, welche Eingaben gibt es, und woran erkennst du ein richtiges Ergebnis? In dieser Lektion zerlegen wir genau diesen Weg. Stell dir eine Suchfunktion vor: Eine Person gibt ein Wort ein, das Programm vergleicht es mit vorhandenen Titeln, und der Bildschirm zeigt passende Treffer. Wenn du diesen Ablauf in eigenen Worten erklären kannst, hast du den wichtigsten ersten Schritt gemacht.",
  "web-development-orientation": "Webentwicklung beginnt bei der Aufgabe eines Menschen im Browser. Eine Webseite hat Inhalte, eine sichtbare Gestaltung und ein Verhalten auf Eingaben. HTML ordnet die Inhalte, CSS gestaltet sie, und JavaScript reagiert zum Beispiel auf eine Suche oder einen Klick. Stell dir einen Kursfinder vor: Eine Person sieht die Kurse, tippt einen Begriff und bekommt eine verständliche Trefferliste oder einen Hinweis, wenn nichts passt. Genau diesen Weg planen und bauen wir zuerst ohne unnötige Werkzeuge. Später setzt du dieselbe Idee mit Frontend-Frameworks um und prüfst sie im Browser.",
  "backend-orientation": "Ein Backend ist der Teil einer Anwendung, der Anfragen annimmt, Regeln durchsetzt und Daten verwaltet. Wenn jemand eine Aufgabe speichert, schickt der Browser eine Anfrage. Der Server prüft die Eingabe und die Berechtigung, speichert die Daten und sendet eine klare Antwort zurück. Dieser Weg ist wichtiger als der Name eines Frameworks. Du lernst deshalb erst den Aufbau von Anfrage, Route, Regel und Datenbank. Danach programmierst du den Weg mit Node.js und Express, testest Fehlerfälle und vergleichst ihn mit einer Lösung in Spring Boot.",
  "security-orientation": "IT-Sicherheit bedeutet, ein System und seine Grenzen zu verstehen. Stell dir eine Aufgaben-App vor: Ein Nutzer darf seine eigenen Aufgaben sehen, aber nicht die Aufgaben anderer. Zuerst zeichnest du ein, wo Daten hineinkommen und wer auf sie zugreifen könnte. Dann prüfst du eine konkrete Schwachstelle in einer eigenen Testumgebung und setzt einen Schutz dagegen. Eine Firewall begrenzt Netzwerkverbindungen; sichere Eingabeprüfung und Rechtekontrollen schützen andere Grenzen. In diesem Kurs lernst du, Angriffe nachvollziehbar zu testen, Funde zu beheben und den Schutz anschließend erneut zu prüfen.",
  "ai-orientation": "Ein KI-System besteht nicht nur aus einem Modell. Es braucht passende Daten, eine klar definierte Aufgabe und eine Prüfung an Beispielen, die es beim Lernen noch nicht gesehen hat. Stell dir ein Programm vor, das Rückmeldungen sortiert. Zuerst legst du fest, welche Kategorien sinnvoll sind. Dann vergleichst du eine einfache Regel mit einem trainierten Modell und untersuchst die Fehler. Erst wenn die Ergebnisse belastbar sind, stellst du Vorhersagen über eine Schnittstelle bereit. Der Kurs führt dich von diesen Grundlagen über Training und Auswertung bis zum Betrieb und zur Beobachtung eines Modells.",
  "career-orientation": "Der Weg in einen Entwicklungsberuf beginnt mit echter Arbeit an kleinen Problemen. Du kannst etwa eine Oberfläche verbessern, eine Serverregel bauen oder Daten untersuchen. Solche Proben zeigen dir, welche Aufgaben dich interessieren und welche Fähigkeiten noch fehlen. Danach planst du ein überschaubares Projekt, löst Fehler systematisch und dokumentierst deine Entscheidungen. Ein Portfolio soll nachvollziehbar zeigen, was du selbst gebaut und geprüft hast. In diesem Kurs verbindest du deshalb Orientierung, Projektarbeit, Zusammenarbeit und eine ehrliche Darstellung deiner Ergebnisse.",
  "backend-express-setup": "Heute wird aus einem JavaScript-Programm eine kleine API. Node.js führt den Code außerhalb des Browsers aus; Express nimmt HTTP-Anfragen an und leitet sie an die passende Funktion weiter. Installiere zuerst Node.js und prüfe, ob node und npm im Terminal erreichbar sind. Im Projektordner erzeugst du dann die Paketdatei und installierst Express. Deine erste Route beantwortet eine Zustandsfrage mit JSON. Danach nimmt eine zweite Route einen Titel entgegen. Entscheidend ist: Express verbindet Anfrage und Funktion, aber ob der Titel gültig ist, entscheidest und prüfst du selbst. Rufe beide Routen tatsächlich auf und vergleiche die Antworten für gültige und ungültige Eingaben.",
  "game-development-orientation": "Spieleentwicklung beginnt mit einer spielbaren Regel, nicht mit der Wahl einer Engine. Stell dir eine Figur vor, die ein Ziel erreichen soll. Das Spiel liest eine Eingabe, verändert die Position, prüft eine Berührung und zeigt das Ergebnis. Diesen Ablauf wiederholt es viele Male pro Sekunde. Eine Engine wie Godot oder Unity liefert Werkzeuge für Szenen, Eingaben und Darstellung. Die Spielidee und die Regeln musst du trotzdem selbst gestalten und prüfen. In diesem Kurs baust du deshalb erst einen kleinen funktionierenden Ablauf und erweiterst ihn Schritt für Schritt zu einem exportierbaren Spiel.",
};

function clean(text: string): string {
  return text.replace(/`([^`]+)`/g, "$1").replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
}

export function lessonNarration(lesson: CourseLesson, courseId: string): string {
  if (authored[lesson.id]) return authored[lesson.id];
  const variants = openings[courseId] ?? ["Heute betrachten wir einen Baustein, den du gleich selbst anwenden wirst.", "Lass uns die Idee hinter dieser Lektion an einem konkreten Fall verstehen."];
  const opening = variants[lesson.id.length % variants.length];
  const explanation = clean(lesson.explanation).split(/(?<=[.!?])\s+/).slice(0, 3).join(" ");
  const specificFlow = lesson.systemDiagram && lesson.visualSteps?.length === 3
    ? lesson.visualSteps.map(clean).filter((part) => part.length < 90)
    : [];
  const flow = specificFlow.length === 3 ? `Der Ablauf hat drei Schritte: zuerst ${specificFlow[0]}, dann ${specificFlow[1]}, und schließlich ${specificFlow[2]}.` : "";
  const example = lesson.examples?.find((item) => item.note && item.note !== lesson.explanation)?.note;
  const exampleBridge = example ? `Ein konkreter Anhaltspunkt: ${clean(example)}` : "";
  const task = lesson.task.length < 240 ? `Probiere es danach selbst: ${clean(lesson.task)}` : `Probiere den beschriebenen Ablauf anschließend in der Übung selbst aus.`;
  const check = lesson.acceptanceCriteria?.[0] ? `Achte bei deiner Prüfung besonders darauf: ${clean(lesson.acceptanceCriteria[0])}` : "";
  const title = clean(lesson.title).replace(/[.!?]+$/, "");
  return ["Willkommen. Heute geht es um", `„${title}“.`, opening, explanation, flow, exampleBridge, task, check].filter(Boolean).join(" ");
}
