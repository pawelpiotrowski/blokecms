import { Component, Input } from '@angular/core';
import { verticalToolbarWidth } from '../layout.constant';

@Component({
  selector: 'admin-page-with-toolbar-layout',
  templateUrl: './page-with-toolbar-layout.component.html',
  styleUrls: ['./page-with-toolbar-layout.component.scss'],
})
export class PageWithToolbarLayoutComponent {
  @Input() overrideToolbar = false;
  readonly toolbarWidth = verticalToolbarWidth;

  get toolbarStyle() {
    return {
      flex: `1 1 ${this.toolbarWidth}`,
      'box-sizing': 'border-box',
      'max-width': this.toolbarWidth,
      'min-width': this.toolbarWidth,
    };
  }
}
