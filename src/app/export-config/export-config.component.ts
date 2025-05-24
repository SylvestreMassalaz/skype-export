import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConversationInfo } from '../../model';

@Component({
  selector: 'app-export-config',
  imports: [FormsModule],
  templateUrl: './export-config.component.html',
  styleUrl: './export-config.component.scss'
})
export class ExportConfigComponent {
  conversations = input.required<ConversationInfo[]>()

  exportType = "csv"

  exportConvId = ""

  export_requested = output<ExportConfig>()

  requestExport() {
    this.export_requested.emit({conv_id: this.exportConvId, export_type: this.exportType})
  }
}

export interface ExportConfig {
  conv_id: string
  export_type: string
}
