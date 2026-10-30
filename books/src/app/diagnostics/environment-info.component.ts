import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, VERSION } from '@angular/core';
import { environment } from '../../environments/environment';

/** Eckdaten der laufenden Anwendung. */
@Component({
  selector: 'books-environment-info',
  imports: [DatePipe],
  host: { class: 'card card--padded panel' },
  template: `
    <span class="eyebrow">Umgebung</span>
    <h2 class="panel__title">Anwendung</h2>
    <dl class="facts">
      <div>
        <dt>Angular</dt>
        <dd class="mono">{{ angularVersion }}</dd>
      </div>
      <div>
        <dt>Modus</dt>
        <dd>{{ production ? 'Produktion' : 'Entwicklung' }}</dd>
      </div>
      <div>
        <dt>Backend</dt>
        <dd class="mono">{{ serverUrl }}</dd>
      </div>
      <div>
        <dt>Gestartet</dt>
        <dd>{{ startedAt | date: 'mediumTime' }}</dd>
      </div>
    </dl>
  `,
  styles: `
    .facts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin: 0;
    }

    .facts dt {
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--color-text-muted);
    }

    .facts dd {
      margin: 0.125rem 0 0;
      overflow-wrap: anywhere;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnvironmentInfo {
  protected readonly angularVersion = VERSION.full;
  protected readonly production = environment.production;
  protected readonly serverUrl = environment.SERVER_URL;
  protected readonly startedAt = new Date(performance.timeOrigin);
}
