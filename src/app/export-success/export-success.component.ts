import { Component, input } from '@angular/core';
import FileSaver from 'file-saver';

@Component({
  selector: 'app-export-success',
  imports: [],
  templateUrl: './export-success.component.html',
  styleUrl: './export-success.component.scss'
})
export class ExportSuccessComponent {
  exportFile = input.required<Blob | null>()

  triggerFileDownload() {
    console.info("Triggering export of file")
    const file = this.exportFile()
    if(file === null) {
      console.info("File is null")
      return
    }

    console.info("Saving file as", file)
    FileSaver.saveAs(file)
  }
}
