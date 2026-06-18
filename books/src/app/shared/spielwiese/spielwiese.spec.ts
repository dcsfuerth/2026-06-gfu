import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Spielwiese } from './spielwiese';

describe('Spielwiese', () => {
  let component: Spielwiese;
  let fixture: ComponentFixture<Spielwiese>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Spielwiese],
    }).compileComponents();

    fixture = TestBed.createComponent(Spielwiese);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
