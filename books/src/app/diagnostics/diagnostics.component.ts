import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EnvironmentInfo } from './environment-info.component';
import { ErrorTriggers } from './error-triggers.component';
import { HealthCheck } from './health-check.component';
import { LogLevelSwitch } from './log-level-switch.component';
import { LogViewer } from './log-viewer.component';
import { ProfilingToggle } from './profiling-toggle.component';

/**
 * Diagnose-Seite: ordnet die einzelnen Diagnose-Panels an. Die Fachlichkeit
 * liegt in den Panels selbst, jedes kümmert sich um genau ein Thema.
 */
@Component({
  selector: 'books-diagnostics',
  imports: [
    EnvironmentInfo,
    LogLevelSwitch,
    HealthCheck,
    ErrorTriggers,
    ProfilingToggle,
    LogViewer,
  ],
  template: `
    <section class="page">
      <header class="page__header">
        <div>
          <h1 class="page__title">Diagnose</h1>
          <p class="page__subtitle">Protokoll, Fehlerbehandlung und Backend-Zustand im Blick.</p>
        </div>
      </header>

      <div class="grid">
        <books-environment-info />
        <books-log-level-switch />
        <books-health-check />
        <books-error-triggers />
        <books-profiling-toggle />
      </div>

      <books-log-viewer />
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
      gap: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Diagnostics {}
