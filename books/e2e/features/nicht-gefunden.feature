# language: de
Funktionalität: Unbekannte Adressen
  Als Benutzerin
  möchte ich bei einer falschen Adresse eine verständliche Fehlerseite sehen,
  damit ich zurück zur Anwendung finde.

  Szenario: Die 404-Seite erscheint bei unbekannter URL
    Angenommen ich öffne die Seite "/eine-route-die-es-nicht-gibt"
    Dann sehe ich die Überschrift "Seite nicht gefunden"
    Und führt der Link "Zur Startseite" nach "/"
    Und endet die URL mit "/eine-route-die-es-nicht-gibt"
    Und lautet der Seitentitel "Seite nicht gefunden · Bücherverwaltung"

  Szenario: Die 404-Seite ist barrierefrei
    Angenommen ich öffne die Seite "/eine-route-die-es-nicht-gibt"
    Dann sehe ich die Überschrift "Seite nicht gefunden"
    Und ist die Seite barrierefrei
