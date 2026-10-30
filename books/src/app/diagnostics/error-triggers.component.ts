import { HttpClient, HttpContext } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { REQUEST_TIMEOUT } from '../core/errors';
import { Logger } from '../core/logging';
import { Notifications } from '../core/notifications/notifications.service';

/** Löst gezielt Fehler auf verschiedenen Wegen aus, um die Fehlerbehandlung zu zeigen. */
@Component({
  selector: 'books-error-triggers',
  host: { class: 'card card--padded panel' },
  template: `
    <span class="eyebrow">Fehlerbehandlung</span>
    <h2 class="panel__title">Fehler auslösen</h2>
    <p class="panel__text muted">
      Jeder Button nimmt einen anderen Weg zum globalen ErrorHandler. Ergebnis: Eintrag im Protokoll
      und eine Meldung unten rechts.
    </p>
    <div class="actions">
      <button type="button" class="btn" (click)="throwInHandler()">Fehler im Event-Handler</button>
      <button type="button" class="btn" (click)="rejectPromise()">Abgelehnte Promise</button>
      <button type="button" class="btn" (click)="requestNotFound()">HTTP 404</button>
      <button type="button" class="btn" (click)="requestTimeout()">HTTP-Timeout</button>
      <button type="button" class="btn btn--ghost" (click)="showInfo()">Info-Meldung</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorTriggers {
  private readonly http = inject(HttpClient);
  private readonly notifications = inject(Notifications);
  private readonly log = inject(Logger).withContext('Diagnose');

  throwInHandler(): void {
    throw new Error('Demo: Fehler im Event-Handler');
  }

  rejectPromise(): void {
    void Promise.reject(new Error('Demo: abgelehnte Promise'));
  }

  /** Die Anfrage schlägt mit 404 fehl; der Fehler bleibt unbehandelt und erreicht den ErrorHandler. */
  requestNotFound(): void {
    void firstValueFrom(this.http.get(`${environment.SERVER_URL}/books/gibt-es-nicht`));
  }

  /** Zeitlimit von 1 ms: löst Timeout, Wiederholungen und schließlich den ErrorHandler aus. */
  requestTimeout(): void {
    void firstValueFrom(
      this.http.get(`${environment.SERVER_URL}/books`, {
        context: new HttpContext().set(REQUEST_TIMEOUT, 1),
      }),
    );
  }

  showInfo(): void {
    this.log.info('Demo: Info-Meldung');
    this.notifications.info('Das ist eine Info-Meldung.');
  }
}
