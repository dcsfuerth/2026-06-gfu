# language: de
Funktionalität: App-Shell und Navigation
  Als Benutzerin der Bücherverwaltung
  möchte ich über ein klares Hauptmenü zwischen den Bereichen wechseln,
  damit ich mich jederzeit in der Anwendung zurechtfinde.

  Hintergrund:
    Angenommen folgende Bücher sind im Bestand:
      | ISBN        | Titel      | Preis | Sterne |
      | 123-456-789 | Angular 21 | 19.99 | 3.5    |
    Und ich öffne die Seite "/"

  Szenario: Der Header zeigt die Marke
    Dann zeigt der Header den Markennamen "Bücherverwaltung" mit Link zur Startseite

  Szenario: Das Hauptmenü enthält alle Bereiche
    Dann enthält das Hauptmenü die Einträge:
      | Start          |
      | Bücher         |
      | Taschenrechner |
      | Spielwiese     |

  Szenario: Über das Menü erreiche ich alle Bereiche
    Wenn ich im Hauptmenü auf "Bücher" klicke
    Dann endet die URL mit "/books"
    Und sehe ich die Überschrift "Bücher"
    Und lautet der Seitentitel "Bücher · Bücherverwaltung"
    Wenn ich im Hauptmenü auf "Taschenrechner" klicke
    Dann endet die URL mit "/calculator"
    Und sehe ich die Überschrift "Taschenrechner"
    Wenn ich im Hauptmenü auf "Spielwiese" klicke
    Dann endet die URL mit "/spielwiese"
    Und sehe ich die Überschrift "Spielwiese"
    Wenn ich im Hauptmenü auf "Start" klicke
    Dann endet die URL mit "/"
    Und lautet der Seitentitel "Start · Bücherverwaltung"

  Szenario: Der aktive Bereich ist im Menü markiert
    Wenn ich im Hauptmenü auf "Bücher" klicke
    Dann ist der Menüeintrag "Bücher" als aktiv markiert
    Und ist der Menüeintrag "Start" nicht als aktiv markiert

  Szenario: Der Footer nennt die Angular-Version
    Dann zeigt der Footer die Angular-Version
