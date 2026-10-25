export type CourseLesson = {
  id: string;
  title: string;
  objective: string;
  duration: number;
  language: "javascript";
  concepts: { tag: string; description: string }[];
  explanation: string;
  starterCode: string;
  task: string;
  successPattern: RegExp;
};

export const programmingCourse = {
  id: "programming-intro",
  version: "1.0.0",
  title: "Einstieg in die Programmierung",
  category: "Programmiergrundlagen",
  lessons: [
    {
      id: "program-output", title: "Dein erstes Programm", objective: "Du kannst einen Wert mit JavaScript ausgeben.", duration: 10, language: "javascript",
      concepts: [{ tag: "console.log()", description: "Gibt einen Wert in der Entwicklerkonsole aus." }, { tag: "Anweisung", description: "Eine einzelne Anweisung beschreibt einen Arbeitsschritt." }],
      explanation: "Programme bestehen aus Anweisungen, die der Reihe nach ausgeführt werden. Mit console.log() kannst du einen Text oder Wert in der Konsole sichtbar machen.",
      starterCode: "// Gib eine Begrüßung aus\n",
      task: "Gib mit console.log() den Text Hallo CodeZone aus.", successPattern: /console\s*\.\s*log\s*\(\s*[\"'`]Hallo CodeZone[\"'`]\s*\)/i,
    },
    {
      id: "program-variables", title: "Werte in Variablen speichern", objective: "Du kannst einen Wert mit const oder let benennen und wiederverwenden.", duration: 15, language: "javascript",
      concepts: [{ tag: "const", description: "Legt einen Namen an, der nicht neu zugewiesen wird." }, { tag: "Variable", description: "Ein benannter Platz, über den ein Wert im Programm erreichbar ist." }],
      explanation: "Variablen machen Werte unter einem Namen verfügbar. Verwende const, wenn du den Namen nicht neu belegen musst. Eine aussagekräftige Bezeichnung hilft, den Code später zu verstehen.",
      starterCode: "// Speichere deinen Namen\n\nconsole.log(name);\n",
      task: "Lege eine Variable name mit deinem Namen an und gib sie aus.", successPattern: /(?:const|let)\s+name\s*=\s*[\"'`][^\"'`]+[\"'`][\s\S]*console\s*\.\s*log\s*\(\s*name\s*\)/i,
    },
    {
      id: "program-types", title: "Texte, Zahlen und Wahrheitswerte", objective: "Du erkennst die grundlegenden Datentypen und kannst sie verwenden.", duration: 15, language: "javascript",
      concepts: [{ tag: "string", description: "Text steht in Anführungszeichen." }, { tag: "number", description: "Zahlen können berechnet werden." }, { tag: "boolean", description: "true und false drücken eine Ja/Nein-Aussage aus." }],
      explanation: "JavaScript unterscheidet Werte wie Texte, Zahlen und Wahrheitswerte. Der Typ bestimmt, welche Operationen sinnvoll sind. Mit typeof kannst du den Typ eines Werts untersuchen.",
      starterCode: "const age = 18;\nconst learning = true;\n\n// Gib den Typ von age aus\n",
      task: "Gib mit typeof den Typ der Variable age aus.", successPattern: /console\s*\.\s*log\s*\(\s*typeof\s+age\s*\)/i,
    },
    {
      id: "program-conditions", title: "Entscheidungen mit Bedingungen", objective: "Du kannst mit if und else unterschiedliche Fälle behandeln.", duration: 20, language: "javascript",
      concepts: [{ tag: "if", description: "Führt einen Block aus, wenn die Bedingung wahr ist." }, { tag: "else", description: "Behandelt den anderen Fall." }],
      explanation: "Bedingungen lassen ein Programm abhängig von einem Wert entscheiden. Der Ausdruck in den Klammern wird geprüft; danach läuft der passende Codeblock.",
      starterCode: "const points = 12;\n\n// Prüfe, ob points mindestens 10 ist\n",
      task: "Ergänze eine if/else-Entscheidung für mindestens 10 Punkte.", successPattern: /if\s*\([^)]*points\s*>=\s*10[^)]*\)\s*\{[\s\S]*\}\s*else\s*\{[\s\S]*\}/i,
    },
    {
      id: "program-loops", title: "Wiederholungen mit Schleifen", objective: "Du kannst eine Schleife nutzen, um eine Aktion mehrfach auszuführen.", duration: 20, language: "javascript",
      concepts: [{ tag: "for", description: "Wiederholt Code mit einem Startwert, einer Bedingung und einer Änderung." }, { tag: "Iteration", description: "Ein einzelner Durchlauf einer Schleife." }],
      explanation: "Schleifen sparen Wiederholungen. Eine for-Schleife legt fest, wo sie startet, wann sie endet und wie sich der Zähler verändert.",
      starterCode: "// Gib die Zahlen von 1 bis 5 aus\n",
      task: "Schreibe eine for-Schleife, die i von 1 bis einschließlich 5 zählt.", successPattern: /for\s*\(\s*(?:let|var)\s+i\s*=\s*1\s*;\s*i\s*<=\s*5\s*;\s*i\s*(?:\+\+|\+=\s*1)\s*\)/i,
    },
    {
      id: "program-functions", title: "Eigene Funktionen schreiben", objective: "Du kannst eine Funktion mit einem Parameter definieren und aufrufen.", duration: 20, language: "javascript",
      concepts: [{ tag: "function", description: "Bündelt einen wiederverwendbaren Arbeitsschritt." }, { tag: "Parameter", description: "Übergibt einen Wert an die Funktion." }, { tag: "return", description: "Gibt ein Ergebnis zurück." }],
      explanation: "Funktionen machen wiederkehrende Arbeitsschritte wiederverwendbar. Parameter sind Eingaben, return liefert das berechnete Ergebnis zurück.",
      starterCode: "// Schreibe eine Funktion greet(name)\n\nconsole.log(greet(\"Ada\"));\n",
      task: "Schreibe greet(name), sodass die Funktion eine Begrüßung zurückgibt.", successPattern: /function\s+greet\s*\(\s*name\s*\)\s*\{[\s\S]*return\s+[^;]*name[^;]*;?[\s\S]*\}/i,
    },
    {
      id: "program-mini-project", title: "Mini-Projekt: Punkte auswerten", objective: "Du verbindest Variablen, Arrays, Schleifen und Funktionen in einem kleinen Programm.", duration: 30, language: "javascript",
      concepts: [{ tag: "Array", description: "Speichert mehrere Werte in einer geordneten Liste." }, { tag: "function", description: "Macht die Auswertung als Arbeitsschritt wiederverwendbar." }, { tag: "for...of", description: "Geht nacheinander durch die Werte einer Liste." }],
      explanation: "In kleinen Programmen wirken die Grundlagen zusammen: Daten liegen in einer Liste, eine Funktion wertet sie aus und eine Schleife verarbeitet jeden Eintrag.",
      starterCode: "const scores = [4, 7, 9];\n\nfunction sumScores(values) {\n  // Addiere alle Werte\n}\n\nconsole.log(sumScores(scores));\n",
      task: "Vervollständige sumScores mit einer for...of-Schleife und gib die Summe zurück.", successPattern: /function\s+sumScores\s*\(\s*values\s*\)\s*\{[\s\S]*for\s*\(\s*(?:const|let)\s+\w+\s+of\s+values\s*\)[\s\S]*return\s+\w+\s*;?[\s\S]*\}/i,
    },
  ] satisfies CourseLesson[],
};

export const courseSkills = programmingCourse.lessons.map((lesson) => lesson.id);
