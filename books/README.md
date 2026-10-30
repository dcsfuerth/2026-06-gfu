# Bücherverwaltung (books)

Schulungsprojekt auf Basis von Angular 22: Standalone-Komponenten, Signals, `httpResource`,
Signal Forms, Lazy Routing, zoneless Change Detection, Vitest sowie Playwright mit Gherkin (BDD).

## Voraussetzungen

- Node.js 24, npm 11
- Für die Buchdaten ein lokaler [json-server](https://github.com/typicode/json-server) auf Port 3000
  (siehe `npm run db:mock`)

## Entwicklung

```bash
npm install
npm run db:mock   # Mock-Backend auf http://localhost:3000 (json-server, Daten aus src/data/db.json)
npm start         # Dev-Server auf http://localhost:4200
```

Die Backend-URL steht in `src/environments/environment.development.ts` (Entwicklung) bzw.
`src/environments/environment.ts` (Produktion).

## Skripte

| Skript | Zweck |
|--------|-------|
| `npm start` | Dev-Server mit Live-Reload |
| `npm run build` | Produktions-Build nach `dist/books` |
| `npm test` | Unit-Tests mit Vitest |
| `npm run e2e` | End-to-End-Tests: erzeugt aus den Gherkin-Features Playwright-Tests und führt sie aus (Dev-Server wird bei Bedarf gestartet, Backend gemockt) |
| `npm run e2e:ui` | dasselbe im Playwright-UI-Modus |
| `npm run e2e:gen` | nur die Testgenerierung aus den Feature-Dateien (`bddgen`) |
| `npm run e2e:report` | Letzten Playwright-Report öffnen |
| `npm run db:mock` | json-server mit `src/data/db.json` starten |
| `npm run docs` | Compodoc-Dokumentation erzeugen |

## Struktur

```
src/app
├── app.ts / app.html / app.css     App-Shell: Header, Navigation, Footer
├── app.config.ts                   Provider (Locale, HttpClient mit fetch, Router mit Input-Binding)
├── app.routes.ts                   Lazy geladene Routen mit Seitentiteln
├── locale.ts                       Deutsche Locale + Euro als Standardwährung
├── books/
│   ├── book.ts                     Datenmodell
│   ├── book-guard.ts               Route-Guard: ISBN-Format prüfen, sonst Umleitung
│   ├── bookdata/book-data.ts       Datenzugriff über httpResource / HttpClient
│   ├── book-list/                  Liste mit Suche, Cover-Toggle, Bewertung, Löschen
│   ├── book-detail/                Detailseite, ISBN kommt als Router-Input
│   └── welcome/                    Startseite
└── shared/
    ├── rating/                     Sternebewertung (input()/output())
    ├── calculator/                 Taschenrechner mit Signal Forms
    ├── spielwiese/                 RxJS-Streams und Signals (toSignal, computed)
    └── not-found/                  404-Seite
```

### End-to-End-Tests mit Gherkin

```
e2e
├── features/        Szenarien in deutschem Gherkin (Funktionalität, Szenario, Angenommen/Wenn/Dann)
├── steps/           Step-Definitionen (playwright-bdd) und gemeinsame Fixtures
└── fixtures/        Mock des json-server-Backends per page.route()
```

[playwright-bdd](https://vitalets.github.io/playwright-bdd/) übersetzt die Feature-Dateien in native
Playwright-Tests (`.features-gen`, nicht versioniert). Testdaten werden in den Szenarien selbst als
Tabelle angegeben (`Angenommen folgende Bücher sind im Bestand:`). Für Syntax-Hervorhebung und
Step-Navigation empfiehlt sich die VS-Code-Erweiterung „Cucumber (Gherkin) Full Support“.

Globale Design-Tokens und wiederverwendbare Bausteine (`.card`, `.btn`, `.input`, `.notice`, …)
liegen in `src/styles.css`; Hell- und Dunkelmodus folgen der Systemeinstellung.

## Weiterführend

- [Angular-Dokumentation](https://angular.dev)
- [Signals](https://angular.dev/guide/signals), [httpResource](https://angular.dev/guide/http/http-resource),
  [Signal Forms](https://angular.dev/guide/forms/signals)
