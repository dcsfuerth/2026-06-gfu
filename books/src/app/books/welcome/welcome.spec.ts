import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Welcome } from './welcome';

describe('Welcome', () => {
  let component: Welcome;
  let fixture: ComponentFixture<Welcome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Welcome],
    }).compileComponents();

    fixture = TestBed.createComponent(Welcome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the welcome title', () => {
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector('.welcome__title');
    expect(title?.textContent).toContain('Willkommen in der Bücherverwaltung!');
  });
});
