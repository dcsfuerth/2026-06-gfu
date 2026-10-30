# language: de
Funktionalität: Buchdetails und Route-Guard
  Als Benutzerin
  möchte ich zu einem Buch alle Details sehen
  und bei ungültigen Adressen sinnvoll weitergeleitet werden.

  Hintergrund:
    Angenommen folgende Bücher sind im Bestand:
      | ISBN        | Titel      | Preis | Sterne | Kommentar            |
      | 123-456-789 | Angular 21 | 19.99 | 3.5    |                      |
      | 987-654-321 | Angular 22 | 29.90 | 4.5    | Sehr empfehlenswert. |

  Szenario: Detailseite eines günstigen Buchs ohne Kommentar
    Angenommen ich öffne die Seite "/book/123-456-789"
    Dann endet die URL mit "/book/123-456-789"
    Und sehe ich die Überschrift "Angular 21"
    Und sehe ich den Text "123-456-789"
    Und sehe ich den Text "19,99 €"
    Und sehe ich den Text "Angebot"
    Und sehe ich die Bewertung "3.5 von 5 Sternen"
    Und sehe ich den Text "Kein Kommentar vorhanden."
    Und lautet der Seitentitel "Buchdetails · Bücherverwaltung"

  Szenario: Detailseite eines Buchs mit Kommentar
    Angenommen ich öffne die Seite "/book/987-654-321"
    Dann sehe ich die Überschrift "Angular 22"
    Und sehe ich den Text "Sehr empfehlenswert."
    Und sehe ich den Text "Angebot" nicht

  Szenario: Eine ungültige ISBN wird vom Guard auf die Liste umgeleitet
    Angenommen ich öffne die Seite "/book/keine-isbn"
    Dann endet die URL mit "/books"
    Und sehe ich die Überschrift "Bücher"

  Szenario: Eine unbekannte ISBN zeigt einen Hinweis
    Angenommen ich öffne die Seite "/book/000-000-000"
    Dann sehe ich die Überschrift "Buch nicht gefunden"
    Und führt der Link "Zur Buchliste" nach "/books"

  Szenario: Von der Liste zur Detailseite und zurück
    Angenommen ich öffne die Seite "/books"
    Wenn ich auf den Link "Angular 21" klicke
    Dann endet die URL mit "/book/123-456-789"
    Und sehe ich die Überschrift "Angular 21"
    Wenn ich auf den Link "Zurück zur Liste" klicke
    Dann endet die URL mit "/books"
