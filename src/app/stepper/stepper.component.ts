import { Component, computed, input } from '@angular/core';
import { StepComponent } from "./step/step.component";
import { ExportState } from '../export.service';

@Component({
  selector: 'app-stepper',
  imports: [StepComponent],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss'
})
export class StepperComponent {
  status = input.required<ExportState>()

  stepData = computed<StepData[]>(() =>{
    let currentStatus = this.status();
    return [
      {
        step: 1,
        label: "Upload the messages.json file",
        current: currentStatus === ExportState.MESSAGES_FILE_UPLOAD
      },
      {
        step: 2,
        label: "Configure export",
        current: currentStatus === ExportState.MESSAGES_FILE_LOADING || currentStatus === ExportState.CONVERSATION_CHOICE
      },
      {
        step: 3,
        label: "Enjoy!",
        current: currentStatus === ExportState.EXPORT_ONGOING || currentStatus === ExportState.EXPORT_SUCCESS
      }
    ]
  })
}

interface StepData {
  step: number;
  label: string;
  current: boolean;
}
