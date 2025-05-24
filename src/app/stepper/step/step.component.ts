import { Component, input } from '@angular/core';

@Component({
  selector: 'app-step',
  imports: [],
  templateUrl: './step.component.html',
  styleUrl: './step.component.scss'
})
export class StepComponent {

  step = input.required<number>()
  label = input.required<string>()
  current = input.required<boolean>()

}
