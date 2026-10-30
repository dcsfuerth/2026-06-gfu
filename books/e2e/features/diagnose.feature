# language: de
Funktionalität: Diagnose-Seite
  Als Entwicklerin
  möchte ich Protokoll, Fehlerbehandlung und Backend-Zustand in der Anwendung sehen,
  damit ich Probleme schnell eingrenzen kann.

  Hintergrund:
    Angenommen folgende Bücher sind im Bestand:
      | ISBN        | Titel      | Preis | Sterne |
      | 123-456-789 | Angular 21 | 19.99 | 3.5    |
    Und ich öffne die Seite "/diagnose"

  Szenario: Umgebung und Backend-Status werden angezeigt
    Dann sehe ich die Überschrift "Diagnose"
    Und sehe ich die Angular-Version
    Und ist das Backend als "erreichbar" markiert

  Szenario: Das Protokoll enthält die Navigation und den Backend-Aufruf
    Dann enthält das Protokoll einen Eintrag "Navigation #1 nach /diagnose abgeschlossen"
    Und enthält das Protokoll einen Eintrag mit Level "info" und Kontext "Http"

  Szenario: Das Log-Level lässt sich umschalten
    Wenn ich das Log-Level auf "warn" setze
    Dann ist das Log-Level "warn" aktiv
    Und enthält das Protokoll einen Eintrag "Log-Level auf „warn“ gesetzt"

  Szenario: Das Protokoll lässt sich filtern und leeren
    Wenn ich das Protokoll nach "Router" durchsuche
    Dann enthält jede Protokollzeile den Kontext "Router"
    Wenn ich auf den Button "Leeren" klicke
    Dann sehe ich den Text "Keine Einträge."

  @fehler-erwartet
  Szenario: Ein Fehler im Event-Handler erreicht den globalen ErrorHandler
    Wenn ich auf den Button "Fehler im Event-Handler" klicke
    Dann sehe ich die Fehlermeldung "Demo: Fehler im Event-Handler"
    Und enthält das Protokoll einen Eintrag mit Level "error" und Kontext "ErrorHandler"

  @fehler-erwartet
  Szenario: Eine abgelehnte Promise erreicht den globalen ErrorHandler
    Wenn ich auf den Button "Abgelehnte Promise" klicke
    Dann sehe ich die Fehlermeldung "Demo: abgelehnte Promise"

  @fehler-erwartet
  Szenario: Ein HTTP 404 wird verständlich gemeldet
    Wenn ich auf den Button "HTTP 404" klicke
    Dann sehe ich die Fehlermeldung "Der angeforderte Datensatz wurde nicht gefunden."
    Und enthält das Protokoll einen Eintrag mit Level "warn" und Kontext "Http"

  Szenario: Eine Info-Meldung erscheint und lässt sich schließen
    Wenn ich auf den Button "Info-Meldung" klicke
    Dann sehe ich die Meldung "Das ist eine Info-Meldung."
    Wenn ich auf den Button "Meldung schließen" klicke
    Dann sehe ich den Text "Das ist eine Info-Meldung." nicht

  Szenario: Die Seite ist barrierefrei
    Dann ist die Seite barrierefrei
