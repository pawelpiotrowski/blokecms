import { Directive, EventEmitter, Output, HostListener } from '@angular/core';

@Directive({
  selector: '[adminMediaUploadDragDrop]',
})
export class MediaUploadDragDropDirective {
  @Output() fileDropped = new EventEmitter<FileList>();
  @Output() fileDragOver = new EventEmitter();
  @Output() fileDragLeave = new EventEmitter();

  // Dragover Event
  @HostListener('dragover', ['$event']) dragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.fileDragOver.emit();
  }

  // Dragleave Event
  @HostListener('dragleave', ['$event']) public dragLeave(
    event: DragEvent,
  ): void {
    event.preventDefault();
    event.stopPropagation();
    this.fileDragLeave.emit();
  }

  // Drop Event
  @HostListener('drop', ['$event']) public drop(event: DragEvent): void {
    if (!event) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;

    if (files && files.length > 0) {
      this.fileDropped.emit(files);
    }
  }
}
