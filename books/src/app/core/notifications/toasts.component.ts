import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Notifications } from './notifications.service';

@Component({
  selector: 'books-toasts',
  template: `
    <div class="toasts" aria-live="polite" aria-atomic="false">
      @for (toast of notifications.all(); track toast.id) {
        <div
          class="toast"
          [class.toast--success]="toast.kind === 'success'"
          [class.toast--error]="toast.kind === 'error'"
          [attr.role]="toast.kind === 'error' ? 'alert' : 'status'"
        >
          <span class="toast__message">{{ toast.message }}</span>
          <button
            type="button"
            class="toast__close"
            aria-label="Meldung schließen"
            (click)="notifications.dismiss(toast.id)"
          >
            ×
          </button>
        </div>
      }
    </div>
  `,
  styleUrl: './toasts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toasts {
  protected readonly notifications = inject(Notifications);
}
