import { Component, EventEmitter, Output } from '@angular/core';
import { NavigationFormLink } from '../navigation-form.interface';

@Component({
  selector: 'admin-navigation-form-toolbar',
  templateUrl: './navigation-form-toolbar.component.html',
  styleUrls: ['./navigation-form-toolbar.component.scss'],
})
export class NavigationFormToolbarComponent {
  @Output() addNewLink = new EventEmitter<NavigationFormLink>();

  addNew: NavigationFormLink | null = null;

  addNewExternalLink() {
    this.addNew = {
      label: '',
      index: -1,
      url: '',
    };
  }

  addNewInternalLink() {
    this.addNew = {
      label: '',
      index: -1,
      pageId: '',
    };
  }

  cancelAddNew() {
    this.addNew = null;
  }

  linkAddHandler(item: NavigationFormLink) {
    this.addNewLink.emit(item);
    this.cancelAddNew();
  }
}
