import {
  DestroyRef,
  EnvironmentProviders,
  inject,
  provideEnvironmentInitializer,
} from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationSkipped,
  NavigationStart,
  Router,
} from '@angular/router';
import { Logger } from '../logging';

/**
 * Protokolliert Navigationen über den zentralen Logger.
 *
 * Die Subscription lebt so lange wie der Environment-Injector; `DestroyRef`
 * räumt sie beim Zerstören der Anwendung auf.
 */
export function provideRouterLogging(): EnvironmentProviders {
  return provideEnvironmentInitializer(() => {
    const log = inject(Logger).withContext('Router');
    const router = inject(Router);
    const startedAt = new Map<number, number>();

    const subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        startedAt.set(event.id, performance.now());
        log.debug(`Navigation #${event.id} nach ${event.url} gestartet`, {
          trigger: event.navigationTrigger,
        });
      } else if (event instanceof NavigationEnd) {
        const started = startedAt.get(event.id);
        startedAt.delete(event.id);
        const duration =
          started === undefined ? '' : ` (${Math.round(performance.now() - started)} ms)`;
        log.info(
          `Navigation #${event.id} nach ${event.urlAfterRedirects} abgeschlossen${duration}`,
        );
      } else if (event instanceof NavigationCancel) {
        startedAt.delete(event.id);
        log.warn(`Navigation #${event.id} nach ${event.url} abgebrochen`, {
          code: event.code,
          reason: event.reason,
        });
      } else if (event instanceof NavigationSkipped) {
        log.debug(`Navigation #${event.id} nach ${event.url} übersprungen`, {
          reason: event.reason,
        });
      }
    });

    inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
  });
}
