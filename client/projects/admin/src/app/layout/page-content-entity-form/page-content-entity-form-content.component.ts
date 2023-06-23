import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';

/**
 * Generics:
 * C: Content type
 */
@Component({ template: '' })
export abstract class PageContentEntityFormContentComponent<C>
  implements OnChanges
{
  @Input() expanded!: boolean;
  @Input() content!: C[];
  @Output() contentUpdate = new EventEmitter<C[]>();
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['expanded'] == null || changes['expanded'].isFirstChange()) {
      return;
    }
    this.toggleAccordionExpand(changes['expanded'].currentValue);
  }

  dragHandleClickHandler(event: MouseEvent) {
    event.stopPropagation();
  }

  dropSortBlocks(event: CdkDragDrop<C[]>) {
    const content = [...this.content];

    moveItemInArray(content, event.previousIndex, event.currentIndex);

    this.content = [...content];

    this.contentUpdate.emit(this.content);
  }

  private toggleAccordionExpand(toggleTo: boolean) {
    if (this.accordion == null) {
      return;
    }

    if (toggleTo) {
      this.accordion.openAll();
      return;
    }
    this.accordion.closeAll();
  }
}
