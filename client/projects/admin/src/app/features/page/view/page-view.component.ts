import { Component, Input } from '@angular/core';
import { Page } from 'shared-lib';

@Component({
  selector: 'admin-page-view',
  templateUrl: './page-view.component.html',
  styleUrls: ['./page-view.component.scss'],
})
export class PageViewComponent {
  @Input() page!: Page;
}
