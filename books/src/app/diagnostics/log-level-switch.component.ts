import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LOG_LEVELS, LogLevel, Logger } from '../core/logging';

/** Schaltet das Mindest-Level des Loggers um. */
@Component({
  selector: 'books-log-level-switch',
  host: { class: 'card card--padded panel' },
  template: `
    <span class="eyebrow">Logger</span>
    <h2 class="panel__title">Log-Level</h2>
    <p class="panel__text muted">Einträge unterhalb des gewählten Levels werden verworfen.</p>
    <div class="actions" role="group" aria-label="Log-Level">
      @for (level of levels; track level) {
        <button
          type="button"
          class="btn"
          [class.btn--primary]="logger.level() === level"
          [attr.aria-pressed]="logger.level() === level"
          (click)="setLevel(level)"
        >
          {{ level }}
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogLevelSwitch {
  protected readonly logger = inject(Logger);
  private readonly log = this.logger.withContext('Diagnose');

  protected readonly levels = LOG_LEVELS;

  setLevel(level: LogLevel): void {
    // Erst protokollieren, dann umschalten: Sonst würde der Eintrag beim Wechsel
    // auf ein höheres Level sofort verworfen.
    this.log.info(`Log-Level auf „${level}“ gesetzt`);
    this.logger.setLevel(level);
  }
}
