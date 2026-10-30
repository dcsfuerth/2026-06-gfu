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
| `npm run test:coverage` | Unit-Tests mit Coverage-Report (Text und HTML unter `coverage/`) |
| `npm run lint` | ESLint mit angular-eslint (inkl. Template- und Barrierefreiheitsregeln) |
| `npm run e2e` | End-to-End-Tests: erzeugt aus den Gherkin-Features Playwright-Tests und führt sie aus (Dev-Server wird bei Bedarf gestartet, Backend gemockt) |
| `npm run e2e:ui` | dasselbe im Playwright-UI-Modus |
| `npm run e2e:gen` | nur die Testgenerierung aus den Feature-Dateien (`bddgen`) |
| `npm run e2e:report` | Letzten Playwright-Report öffnen |
| `npm run db:mock` | json-server mit `src/data/db.json` starten |
| `npm run analyze` | Produktions-Build mit Bundle-Analyse (`dist/bundle-report.html`) |
| `npm run docs` / `docs:serve` | Compodoc-Dokumentation erzeugen bzw. lokal anzeigen |

## Struktur

```
src/app
├── app.component.ts/.html/.css     App-Shell: Header, Navigation, Footer
├── app.config.ts                   Provider (Locale, Logging, ErrorHandler, HttpClient, Router)
├── app.routes.ts                   Lazy geladene Routen mit Seitentiteln
├── locale.providers.ts             Deutsche Locale + Euro als Standardwährung
├── core/
│   ├── logging/                    logger.service, *.sink, logging.config/.providers
│   ├── errors/                     app.error, global-error.handler, *.interceptor
│   ├── notifications/              notifications.service, toasts.component
│   └── router/                     router-logging.providers
├── diagnostics/                    Diagnose-Seite (/diagnose): diagnostics.component ordnet die
│                                   Panels an (environment-info, log-level-switch, health-check,
│                                   error-triggers, profiling-toggle, log-viewer)
├── books/
│   ├── book.model.ts               Datenmodell
│   ├── book.guard.ts               Route-Guard: ISBN-Format prüfen, sonst Umleitung
│   ├── bookdata/book-data.service.ts  Datenzugriff über httpResource / HttpClient
│   ├── book-list/                  Liste mit Suche, Cover-Toggle, Bewertung, Löschen
│   ├── book-detail/                Detailseite, ISBN kommt als Router-Input
│   └── welcome/                    Startseite
└── shared/
    ├── rating/                     Sternebewertung (input()/output())
    ├── calculator/                 Taschenrechner mit Signal Forms
    ├── spielwiese/                 RxJS-Streams und Signals (toSignal, computed)
    └── not-found/                  404-Seite
```

Dateinamen folgen dem Muster `name.typ.ts` (`*.component.ts`, `*.service.ts`, `*.guard.ts`,
`*.interceptor.ts`, `*.model.ts`, `*.providers.ts`); die Klassennamen tragen kein Suffix. Die
CLI-Schematics in `angular.json` sind entsprechend eingestellt, `ng generate` erzeugt also passende Namen.

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

## Diagnose und Fehleranalyse

Die Anwendung zeigt bewusst, welche Mittel zur Diagnose in einer Angular-Anwendung vorgesehen sein können.

**Logging.** `Logger` (`src/app/core/logging`) hat die Level `debug`, `info`, `warn`, `error`. Komponenten
und Services holen sich einen Kontext-Logger: `inject(Logger).withContext('BookList')`. Einträge gehen an
alle Senken, die über das Multi-Provider-Token `LOG_SINK` registriert sind: die Konsole (einzige Stelle mit
`console.*`, per ESLint-Regel abgesichert) und ein Ringpuffer im Speicher (`MemorySink`, 200 Einträge). Das
Start-Level wird in `app.config.ts` per `provideLogging({ level: environment.logLevel })` gesetzt, kann auf
der Diagnose-Seite umgeschaltet werden und wird im `localStorage` gemerkt. Der Router protokolliert Start, Ende, Abbruch und Dauer jeder Navigation.

**HTTP.** Zwei Interceptoren (`src/app/core/errors`): `httpLoggingInterceptor` setzt eine Korrelations-ID
(`X-Request-Id`, UUID oder außerhalb eines Secure Context eine einfache Zufallskennung) und protokolliert
Status und Dauer. `httpErrorInterceptor` setzt ein Zeitlimit je Versuch
(`REQUEST_TIMEOUT`, Standard 10 s), wiederholt GET-Requests bei Netzwerk-, Timeout- und 5xx-Fehlern mit
Backoff und übersetzt alle Fehler in `AppError` mit verständlicher Meldung (`offline`, `timeout`, `not-found`,
`client`, `server`, `unknown`). Beides ist pro Request über `HttpContext` steuerbar.

**Fehlerbehandlung.** `GlobalErrorHandler` ersetzt Angulars Standard-Handler, protokolliert vollständig,
zeigt eine kurze Meldung als Toast (`Notifications`) und unterdrückt Doppelmeldungen.
`provideBrowserGlobalErrorListeners()` leitet auch `window.onerror` und `unhandledrejection` dorthin.
Navigationsfehler laufen über `withNavigationErrorHandler`. Im Entwicklungsmodus ist
`provideCheckNoChangesConfig({ exhaustive: true })` aktiv.

**Diagnose-Seite** (`/diagnose`): Umgebung, Log-Level, Protokoll mit Filter und Download, Backend-Check
mit Antwortzeit, Buttons zum gezielten Auslösen von Fehlern (Event-Handler, Promise, HTTP 404, Timeout)
und ein Schalter für `enableProfiling()`, der Angular-Daten in das Chrome-Performance-Panel bringt.

**Werkzeuge.**
- Angular DevTools (Komponentenbaum, Profiler, Injector-Baum, Signal-Graph); in der Konsole
  `ng.getComponent($0)` und `ng.getInjector($0)` (nur Entwicklungsmodus).
- VS Code: Launch-Konfigurationen für `ng serve` (Chrome-Debugging), Vitest mit Node-Inspector und
  Playwright im Debug-Modus.
- E2E: Jedes Szenario scheitert bei `console.error` oder unbehandelten Fehlern im Browser (Fixture
  `consoleGuard`); Szenarien, die Fehler absichtlich auslösen, tragen den Tag `@fehler-erwartet`.
  Der Schritt `Dann ist die Seite barrierefrei` prüft mit axe-core gegen WCAG 2.1 A/AA.
  Bei Fehlschlägen liegen Trace, Screenshot und Video unter `test-results/`, `npm run e2e:report` öffnet
  den Bericht.
- `npm run test:coverage`, `npm run lint`, `npm run analyze`, `npm run docs`.

## Weiterführend

- [Angular-Dokumentation](https://angular.dev)
- [Signals](https://angular.dev/guide/signals), [httpResource](https://angular.dev/guide/http/http-resource),
  [Signal Forms](https://angular.dev/guide/forms/signals)
