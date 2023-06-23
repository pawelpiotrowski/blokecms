import { Component, Input } from '@angular/core';
import { Style } from 'shared-lib';

@Component({
  selector: 'admin-style-view',
  templateUrl: './style-view.component.html',
  styleUrls: ['./style-view.component.scss'],
})
export class StyleViewComponent {
  @Input() style!: Style;
}
