import { Component, output } from '@angular/core';

@Component({
  selector: 'app-message-upload',
  imports: [],
  templateUrl: './message-upload.component.html',
  styleUrl: './message-upload.component.scss'
})
export class MessageUploadComponent {

  fileSelected = output<File>()

  onFileSelected(target: EventTarget | null) {
    let files = (target as HTMLInputElement).files!!
    console.info("Emitting selected file", files[0])
    this.fileSelected.emit(files[0])
  }
}
