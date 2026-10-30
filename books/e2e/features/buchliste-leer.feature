# language: de
Funktionalität: Buchliste ohne Bücher
  Als Benutzerin
  möchte ich bei leerem Bestand einen freundlichen Hinweis sehen,
  damit ich weiß, dass die Anwendung funktioniert und nur keine Daten vorliegen.

  Szenario: Leerzustand
    Angenommen es sind keine Bücher im Bestand
    Und ich öffne die Seite "/books"
    Dann sehe ich den Text "Leider noch keine Bücher vorhanden."
