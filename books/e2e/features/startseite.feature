# language: de
Funktionalität: Startseite
  Als neue Benutzerin
  möchte ich auf der Startseite begrüßt werden und die Bereiche der Anwendung sehen,
  damit ich direkt einsteigen kann.

  Hintergrund:
    Angenommen ich öffne die Seite "/"

  Szenario: Begrüßung und Erläuterung
    Dann sehe ich die Überschrift "Willkommen in der Bücherverwaltung!"
    Und sehe ich den Text "Verwalte deine Bücher, durchsuche deine Sammlung und behalte den Überblick."

  Szenario: Einstiegspunkte zu den Bereichen
    Dann führt der Link "Zu den Büchern" im Hauptbereich nach "/books"
    Und führt der Link "Taschenrechner" im Hauptbereich nach "/calculator"
    Und führt der Link "Spielwiese" im Hauptbereich nach "/spielwiese"
