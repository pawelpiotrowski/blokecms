import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MediaUploadFile } from './media-upload.interface';

@Component({
  selector: 'admin-media-upload',
  templateUrl: './media-upload.component.html',
  styleUrls: ['./media-upload.component.scss'],
})
export class MediaUploadComponent {
  @ViewChild('fileField') fileField!: ElementRef;
  @Input() accept = 'image/*';
  @Output() mediaAdded = new EventEmitter<MediaUploadFile>();

  // this is toggled via @Output on adminMediaUploadDragDrop directive
  draggingOver = false;

  handle(e: FileList | Event): void {
    const eventFile: FileList | null = this.isInputEvent(e)
      ? (e.target as HTMLInputElement)?.files
      : e;

    this.draggingOver = false;
    const fileList = Array.from(eventFile!);

    if (!fileList.length) {
      return;
    }

    this.getImageInfoAndEmitFile(fileList);
  }

  private isInputEvent(event: FileList | Event): event is Event {
    return 'target' in event;
  }

  private getImageInfoAndEmitFile(files: File[]): void {
    const loadedImage = new Image();
    loadedImage.onload = () => {
      const fileObjDto: MediaUploadFile = {
        file: files[0],
        isPortrait: loadedImage.naturalHeight > loadedImage.naturalWidth,
        isSquare: loadedImage.naturalHeight === loadedImage.naturalWidth,
        naturalHeight: loadedImage.naturalHeight,
        naturalWidth: loadedImage.naturalWidth,
      };
      URL.revokeObjectURL(loadedImage.src); // free memory
      this.mediaAdded.emit(fileObjDto);
    };
    loadedImage.crossOrigin = 'Anonymous';
    loadedImage.src = URL.createObjectURL(files[0]);
  }
}
