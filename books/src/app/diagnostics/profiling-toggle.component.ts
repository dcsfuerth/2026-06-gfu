import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  enableProfiling,
  inject,
  signal,
} from '@angular/core';
import { Logger } from '../core/logging';

/** Schaltet `enableProfiling()` ein und aus (Angular-Daten im Chrome-Performance-Panel). */
@Component({
  selector: 'books-profiling-toggle',
  host: { class: 'card card--padded panel' },
  template: `
    <span class="eyebrow">Performance</span>
    <h2 class="panel__title">Profiling</h2>
    <p class="panel__text muted">
      Angular meldet Change Detection, Effects und Lifecycle an das Chrome-Performance-Panel (nur im
      Entwicklungsmodus). Danach in den DevTools eine Aufzeichnung starten.
    </p>
    <div class="actions">
      <button type="button" class="btn" [attr.aria-pressed]="profiling()" (click)="toggle()">
        {{ profiling() ? 'Profiling beenden' : 'Profiling starten' }}
      </button>
    </div>
    <ul class="hints muted">
      <li>Angular DevTools: Komponentenbaum, Profiler, Injector-Baum, Signal-Graph.</li>
      <li>Konsole: <code>ng.getComponent($0)</code>, <code>ng.getInjector($0)</code>.</li>
    </ul>
  `,
  styles: `
    .hints {
      margin: 0;
      padding-left: 1.25rem;
      font-size: 0.8125rem;
    }

    .hints code {
      font-family: var(--font-mono);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilingToggle {
  private readonly log = inject(Logger).withContext('Diagnose');
  private stopProfiling: (() => void) | undefined;

  protected readonly profiling = signal(false);

  constructor() {
    // Beim Verlassen der Seite geht der Schalterzustand verloren; das Profiling endet mit.
    inject(DestroyRef).onDestroy(() => this.stopProfiling?.());
  }

  toggle(): void {
    if (this.stopProfiling) {
      this.stopProfiling();
      this.stopProfiling = undefined;
      this.profiling.set(false);
      this.log.info('Profiling beendet');
    } else {
      this.stopProfiling = enableProfiling();
      this.profiling.set(true);
      this.log.info(
        'Profiling gestartet: Aufzeichnung im Chrome-Performance-Panel zeigt Angular-Daten',
      );
    }
  }
}
