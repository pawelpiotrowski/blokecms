import { Component, Input } from '@angular/core';
import { BlockText } from 'shared-lib';

@Component({
  selector: 'admin-block-view',
  templateUrl: './block-view.component.html',
  styleUrls: ['./block-view.component.scss'],
})
export class BlockViewComponent {
  @Input() blockText!: BlockText;
  @Input() showName = false;
}
