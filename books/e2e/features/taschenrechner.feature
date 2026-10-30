# language: de
Funktionalität: Taschenrechner
  Als Benutzerin
  möchte ich zwei Zahlen addieren oder subtrahieren,
  damit ich kleine Rechnungen direkt in der Anwendung erledigen kann.

  Hintergrund:
    Angenommen ich öffne die Seite "/calculator"

  Szenario: Startzustand
    Dann zeigt der Rechner das Ergebnis "0"

  Szenariogrundriss: Rechnen mit zwei Werten
    Wenn ich in das Feld "Wert x" den Wert "<x>" eingebe
    Und ich in das Feld "Wert y" den Wert "<y>" eingebe
    Und ich auf den Button "<Operation>" klicke
    Dann zeigt der Rechner das Ergebnis "<Ergebnis>"

    Beispiele:
      | x   | y    | Operation | Ergebnis |
      | 5   | 3    | +         | 8        |
      | 10  | 4    | −         | 6        |
      | 2.5 | 1.25 | +         | 3,75     |
      | 1   | 4    | −         | -3       |

  Szenario: Leere Felder zählen als 0
    Wenn ich in das Feld "Wert x" den Wert "7" eingebe
    Und ich auf den Button "+" klicke
    Dann zeigt der Rechner das Ergebnis "7"

  Szenario: Enter im Feld addiert
    Wenn ich in das Feld "Wert x" den Wert "1" eingebe
    Und ich in das Feld "Wert y" den Wert "2" eingebe
    Und ich im Feld "Wert y" Enter drücke
    Dann zeigt der Rechner das Ergebnis "3"

  Szenario: Ein verlassenes leeres Feld wird als Pflichtfeld markiert
    Wenn ich das Feld "Wert x" fokussiere
    Und ich das Feld "Wert y" fokussiere
    Dann sehe ich den Text "Bitte einen Wert eingeben."
    Und ist das Feld "Wert x" als ungültig markiert

  Szenario: C setzt Eingaben und Ergebnis zurück
    Wenn ich in das Feld "Wert x" den Wert "9" eingebe
    Und ich in das Feld "Wert y" den Wert "9" eingebe
    Und ich auf den Button "+" klicke
    Dann zeigt der Rechner das Ergebnis "18"
    Wenn ich auf den Button "C" klicke
    Dann zeigt der Rechner das Ergebnis "0"
    Und ist das Feld "Wert x" leer
    Und ist das Feld "Wert y" leer

  Szenario: Der Taschenrechner ist barrierefrei
    Dann ist die Seite barrierefrei
