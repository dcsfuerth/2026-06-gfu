import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideGermanLocale } from '../../locale.providers';
import { Calculator } from './calculator.component';

describe('Calculator', () => {
  let fixture: ComponentFixture<Calculator>;
  let component: Calculator;

  function input(id: string): HTMLInputElement {
    return fixture.nativeElement.querySelector(`#${id}`);
  }

  function result(): string {
    return fixture.nativeElement.querySelector('.calculator__result-value').textContent.trim();
  }

  async function type(id: string, value: string): Promise<void> {
    const el = input(id);
    el.value = value;
    el.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Calculator],
      providers: [provideGermanLocale()],
    }).compileComponents();
    fixture = TestBed.createComponent(Calculator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('starts with result 0', () => {
    expect(result()).toBe('0');
  });

  it('adds the two operands', async () => {
    await type('calc-x', '5');
    await type('calc-y', '3');
    component.add();
    await fixture.whenStable();
    expect(result()).toBe('8');
  });

  it('subtracts the two operands', async () => {
    await type('calc-x', '10');
    await type('calc-y', '4');
    component.subtract();
    await fixture.whenStable();
    expect(result()).toBe('6');
  });

  it('treats empty fields as 0', async () => {
    await type('calc-x', '7');
    component.add();
    await fixture.whenStable();
    expect(result()).toBe('7');
  });

  it('formats decimals with the German locale', async () => {
    await type('calc-x', '2.5');
    await type('calc-y', '1.25');
    component.add();
    await fixture.whenStable();
    expect(result()).toBe('3,75');
  });

  it('clears inputs and result', async () => {
    await type('calc-x', '9');
    await type('calc-y', '9');
    component.add();
    await fixture.whenStable();
    expect(result()).toBe('18');

    component.clear();
    await fixture.whenStable();
    expect(result()).toBe('0');
    expect(input('calc-x').value).toBe('');
    expect(input('calc-y').value).toBe('');
  });

  it('marks an empty field as invalid once touched', async () => {
    const x = input('calc-x');
    x.dispatchEvent(new Event('blur'));
    await fixture.whenStable();

    expect(x.classList.contains('input--invalid')).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Bitte einen Wert eingeben.');
  });
});
