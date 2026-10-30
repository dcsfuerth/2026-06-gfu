import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';

interface Operands {
  x: number | null;
  y: number | null;
}

type Operation = (x: number, y: number) => number;

const REQUIRED_MESSAGE = 'Bitte einen Wert eingeben.';

/**
 * Kleiner Taschenrechner auf Basis von Signal Forms: Das Modell ist ein
 * Signal, `form()` bindet Validierungslogik daran und `[formField]`
 * verbindet die Inputs mit den Feldern.
 */
@Component({
  selector: 'books-calculator',
  imports: [FormField, DecimalPipe],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Calculator {
  protected readonly operands = signal<Operands>({ x: null, y: null });

  protected readonly calcForm = form(this.operands, (schema) => {
    required(schema.x, { message: REQUIRED_MESSAGE });
    required(schema.y, { message: REQUIRED_MESSAGE });
  });

  protected readonly result = signal(0);

  add(): void {
    this.calculate((x, y) => x + y);
  }

  subtract(): void {
    this.calculate((x, y) => x - y);
  }

  clear(): void {
    this.operands.set({ x: null, y: null });
    this.calcForm().reset();
    this.result.set(0);
  }

  /** Leere Felder zählen als 0. */
  private calculate(operation: Operation): void {
    const { x, y } = this.operands();
    this.result.set(operation(x ?? 0, y ?? 0));
  }
}
