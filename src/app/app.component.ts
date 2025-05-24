import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StepperComponent } from "./stepper/stepper.component";
import { ExportService, ExportState } from './export.service';
import { MessageUploadComponent } from "./message-upload/message-upload.component";
import { LoadingComponent } from "./loading/loading.component";
import { ExportConfigComponent } from "./export-config/export-config.component";
import { ExportSuccessComponent } from "./export-success/export-success.component";
import { ErrorComponent } from "./error/error.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StepperComponent, MessageUploadComponent, LoadingComponent, ExportConfigComponent, ExportSuccessComponent, ErrorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  ExportState = ExportState;

  exportService = inject(ExportService)

  title = 'skype-export';
}
