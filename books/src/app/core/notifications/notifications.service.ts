import { Injectable, signal } from '@angular/core';

export type NotificationKind = 'info' | 'success' | 'error';

export interface Notification {
  readonly id: number;
  readonly kind: NotificationKind;
  readonly message: string;
}

const DEFAULT_DURATION_MS: Record<NotificationKind, number> = {
  info: 4_000,
  success: 4_000,
  error: 8_000,
};

/** Kurzlebige Meldungen für die Nutzerin, angezeigt durch `books-toasts`. */
@Injectable({ providedIn: 'root' })
export class Notifications {
  private readonly items = signal<readonly Notification[]>([]);
  private nextId = 1;

  readonly all = this.items.asReadonly();

  show(kind: NotificationKind, message: string, durationMs = DEFAULT_DURATION_MS[kind]): number {
    const id = this.nextId++;
    this.items.update((items) => [...items, { id, kind, message }]);
    if (durationMs > 0) {
      setTimeout(() => this.dismiss(id), durationMs);
    }
    return id;
  }

  info(message: string): number {
    return this.show('info', message);
  }

  success(message: string): number {
    return this.show('success', message);
  }

  error(message: string): number {
    return this.show('error', message);
  }

  dismiss(id: number): void {
    this.items.update((items) => items.filter((item) => item.id !== id));
  }

  clear(): void {
    this.items.set([]);
  }
}
