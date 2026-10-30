import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';

interface Operands {
  x: number | null;
  y: number | null;
}

/**
 * Kleiner Taschenrechner auf Basis von Signal Forms: Das Modell ist ein
 * Signal, `form()` bindet Validierungslogik daran und `[formField]`
 * verbindet die Inputs mit den Feldern.
 */
@Component({
  selector: 'books-calculator',
  imports: [FormField, DecimalPipe],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Calculator {
  protected readonly operands = signal<Operands>({ x: null, y: null });

  protected readonly calcForm = form(this.operands, (schema) => {
    required(schema.x, { message: 'Bitte einen Wert eingeben.' });
    required(schema.y, { message: 'Bitte einen Wert eingeben.' });
  });

  protected readonly result = signal(0);

  add(): void {
    const { x, y } = this.operands();
    this.result.set((x ?? 0) + (y ?? 0));
  }

  subtract(): void {
    const { x, y } = this.operands();
    this.result.set((x ?? 0) - (y ?? 0));
  }

  clear(): void {
    this.operands.set({ x: null, y: null });
    this.calcForm().reset();
    this.result.set(0);
  }
}
