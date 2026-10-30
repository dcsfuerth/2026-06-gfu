import { HttpClient, HttpContext } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { AppError, REQUEST_TIMEOUT } from '../core/errors';

interface HealthResult {
  readonly ok: boolean;
  readonly status?: number;
  readonly durationMs: number;
  readonly message?: string;
}

/** Prüft, ob das Backend antwortet, und zeigt Status und Antwortzeit. */
@Component({
  selector: 'books-health-check',
  host: { class: 'card card--padded panel' },
  template: `
    <span class="eyebrow">Backend</span>
    <h2 class="panel__title">Erreichbarkeit</h2>
    @if (health.isLoading()) {
      <p class="muted" aria-busy="true">Prüfe …</p>
    } @else if (health.hasValue()) {
      @let result = health.value();
      <p class="health" data-testid="health-status">
        <span class="badge" [class.badge--success]="result.ok" [class.badge--danger]="!result.ok">
          {{ result.ok ? 'erreichbar' : 'nicht erreichbar' }}
        </span>
        @if (result.status) {
          <span class="mono muted">HTTP {{ result.status }}</span>
        }
        <span class="mono muted">{{ result.durationMs }} ms</span>
      </p>
      @if (result.message) {
        <p class="field__error">{{ result.message }}</p>
      }
    }
    <div>
      <button type="button" class="btn" (click)="health.reload()">Erneut prüfen</button>
    </div>
  `,
  styles: `
    .health {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthCheck {
  private readonly http = inject(HttpClient);

  protected readonly health = resource<HealthResult, void>({
    loader: async () => {
      const started = performance.now();
      try {
        const response = await firstValueFrom(
          this.http.get(`${environment.SERVER_URL}/books`, {
            observe: 'response',
            context: new HttpContext().set(REQUEST_TIMEOUT, 5_000),
          }),
        );
        return { ok: true, status: response.status, durationMs: elapsed(started) };
      } catch (error) {
        return { ok: false, durationMs: elapsed(started), message: AppError.from(error).message };
      }
    },
  });
}

function elapsed(started: number): number {
  return Math.round(performance.now() - started);
}
