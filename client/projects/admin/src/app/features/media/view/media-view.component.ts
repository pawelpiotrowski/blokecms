import { Component, Input } from '@angular/core';
import { BlockMedia } from 'shared-lib';

@Component({
  selector: 'admin-media-view',
  templateUrl: './media-view.component.html',
  styleUrls: ['./media-view.component.scss'],
})
export class MediaViewComponent {
  @Input() blockMedia!: BlockMedia;
  @Input() showName = false;
}
