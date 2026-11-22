import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-root',
  imports: [FormField],
  template: `
    <label>Total <input type="number" [formField]="f.total" /></label>
    <label>Count <input type="number" [formField]="f.count" /></label>
    <button (click)="calc()">Calculate</button>
    <label>Average <input type="number" [formField]="f.average" /></label>
    <p>Model: {{ model().average }}</p>
  `,
})
export class App {
  model = signal({ total: 10, count: 4, average: 0 });
  f = form(this.model);

  calc() {
    const { total, count } = this.model();
    this.model.update((m) => ({ ...m, average: total / count }));
  }
}
