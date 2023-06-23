import { Component, Input } from '@angular/core';
import { BlockCode } from 'shared-lib';

@Component({
  selector: 'admin-code-view',
  templateUrl: './code-view.component.html',
  styleUrls: ['./code-view.component.scss'],
})
export class CodeViewComponent {
  @Input() blockCode!: BlockCode;
}
