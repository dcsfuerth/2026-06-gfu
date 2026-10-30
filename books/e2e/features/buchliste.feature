# language: de
Funktionalität: Buchliste
  Als Benutzerin der Bücherverwaltung
  möchte ich meine Bücher in einer übersichtlichen Tabelle sehen, durchsuchen, bewerten und löschen,
  damit ich meine Sammlung im Griff habe.

  Hintergrund:
    Angenommen folgende Bücher sind im Bestand:
      | ISBN        | Titel      | Preis | Sterne | Kommentar            |
      | 123-456-789 | Angular 21 | 19.99 | 3.5    |                      |
      | 987-654-321 | Angular 22 | 29.90 | 4.5    | Sehr empfehlenswert. |
    Und ich öffne die Seite "/books"
    Dann sehe ich 2 Bücher in der Tabelle

  Szenario: Alle Bücher werden angezeigt
    Dann sehe ich das Buch "Angular 21" in der Tabelle
    Und sehe ich das Buch "Angular 22" in der Tabelle
    Und sehe ich den Text "2 von 2 Büchern"

  Szenario: Preise werden im deutschen Währungsformat angezeigt
    Dann sehe ich den Text "19,99 €"
    Und sehe ich den Text "29,90 €"

  Szenario: Günstige Bücher unter 20 € sind als Angebot hervorgehoben
    Dann ist der Preis "19,99 €" als Angebot hervorgehoben
    Und ist der Preis "29,90 €" nicht hervorgehoben

  Szenario: Der Titel verlinkt auf die Detailseite
    Dann ist der Titel "Angular 21" mit "/book/123-456-789" verlinkt

  Szenariogrundriss: Die Suche filtert nach dem Titel
    Wenn ich nach "<Suchbegriff>" suche
    Dann sehe ich <Treffer> Bücher in der Tabelle
    Und sehe ich den Text "Gefiltert nach „<Suchbegriff>“"
    Und sehe ich den Text "<Treffer> von 2 Büchern"

    Beispiele:
      | Suchbegriff | Treffer |
      | 22          | 1       |
      | angular     | 2       |
      | ANGULAR 21  | 1       |

  Szenario: Ohne Treffer erscheint ein Hinweis
    Wenn ich nach "Vue" suche
    Dann sehe ich 0 Bücher in der Tabelle
    Und sehe ich den Text "Keine Treffer für „Vue“."

  Szenario: Die Cover-Spalte lässt sich aus- und einblenden
    Dann ist die Spalte "Cover" sichtbar
    Wenn ich auf den Button "Cover ein/ausblenden" klicke
    Dann ist die Spalte "Cover" nicht sichtbar
    Wenn ich auf den Button "Cover ein/ausblenden" klicke
    Dann ist die Spalte "Cover" sichtbar

  Szenario: Die Bewertung lässt sich erhöhen
    Angenommen hat das Buch "Angular 21" eine Bewertung von "3.5 von 5 Sternen"
    Wenn ich beim Buch "Angular 21" auf "Bewertung erhöhen" klicke
    Dann hat das Buch "Angular 21" eine Bewertung von "3.6 von 5 Sternen"
    Aber hat das Buch "Angular 22" eine Bewertung von "4.5 von 5 Sternen"

  Szenario: Die Bewertung lässt sich verringern
    Wenn ich beim Buch "Angular 21" auf "Bewertung verringern" klicke
    Dann hat das Buch "Angular 21" eine Bewertung von "3.4 von 5 Sternen"

  Szenario: Eine geänderte Bewertung wird im Backend gespeichert
    Wenn ich beim Buch "Angular 21" auf "Bewertung erhöhen" klicke und das Speichern abwarte
    Und ich die Seite neu lade
    Dann hat das Buch "Angular 21" eine Bewertung von "3.6 von 5 Sternen"

  Szenario: Ein Buch wird über das Backend gelöscht
    Wenn ich das Buch "Angular 21" lösche
    Dann wurde das Buch mit der ISBN "123-456-789" am Backend gelöscht
    Und sehe ich 1 Bücher in der Tabelle
    Und sehe ich das Buch "Angular 21" nicht in der Tabelle
    Und sehe ich den Text "1 von 1 Büchern"

  Szenario: Das Löschen lässt sich abbrechen
    Wenn ich das Löschen von "Angular 21" abbreche
    Dann sehe ich 2 Bücher in der Tabelle
    Und sehe ich das Buch "Angular 21" in der Tabelle

  Szenario: Die Buchliste ist barrierefrei
    Dann ist die Seite barrierefrei
