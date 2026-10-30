# language: de
Funktionalität: Spielwiese für RxJS und Signals
  Als Schulungsteilnehmerin
  möchte ich RxJS-Streams und Signals im Zusammenspiel beobachten,
  damit ich die Konzepte besser verstehe.

  Hintergrund:
    Angenommen ich öffne die Seite "/spielwiese"

  Szenario: Der Timer zählt fortlaufend hoch
    Dann steigt der Zählerwert des Timers innerhalb von 4 Sekunden

  Szenario: Das ReplaySubject liefert den Startwert
    Dann sehe ich den Text "Aktueller Zustand: Hallo Spielwiese"

  Szenario: Eine Nachricht wird in das Subject geschoben
    Dann ist der Button "Senden" deaktiviert
    Wenn ich die Nachricht "Hallo Test" eingebe
    Dann ist der Button "Senden" aktiviert
    Wenn ich auf den Button "Senden" klicke
    Dann sehe ich den Text "Aktueller Zustand: Hallo Test"
    Und ist das Nachrichtenfeld leer
    Und enthält die Liste der letzten Nachrichten 2 Einträge

  Szenario: Der Signal-Zähler leitet Verdopplung und Parität ab
    Dann steht der Signal-Zähler auf "0"
    Und lautet die Parität "gerade"
    Wenn ich 3 Mal auf "Zähler erhöhen" klicke
    Dann steht der Signal-Zähler auf "3"
    Und sehe ich den Text "6"
    Und lautet die Parität "ungerade"
    Wenn ich auf den Button "Zurücksetzen" klicke
    Dann steht der Signal-Zähler auf "0"
    Und lautet die Parität "gerade"
