import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'calculator',
  imports: [FormsModule],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css',
})
export class Calculator {
  x: string = '';
  y: string = '';
  result: number = 0;

  add() {
    this.result = (parseFloat(this.x) || 0) + (parseFloat(this.y) || 0);
  }

  subtract() {
    this.result = (parseFloat(this.x) || 0) - (parseFloat(this.y) || 0);
  }

  clear() {
    this.x = '';
    this.y = '';
    this.result = 0;
  }

}
