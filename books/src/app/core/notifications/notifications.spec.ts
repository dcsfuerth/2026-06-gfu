import { TestBed } from '@angular/core/testing';
import { Notifications } from './notifications';

describe('Notifications', () => {
  let notifications: Notifications;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    notifications = TestBed.inject(Notifications);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('adds notifications with increasing ids and removes them after their duration', () => {
    const infoId = notifications.info('Hallo');
    const errorId = notifications.error('Fehler');

    expect(notifications.all().map((n) => n.id)).toEqual([infoId, errorId]);

    vi.advanceTimersByTime(4_000);
    expect(notifications.all().map((n) => n.kind)).toEqual(['error']);

    vi.advanceTimersByTime(4_000);
    expect(notifications.all()).toEqual([]);
  });

  it('dismisses a notification on demand', () => {
    const id = notifications.success('Fertig');
    notifications.dismiss(id);
    expect(notifications.all()).toEqual([]);
  });
});
