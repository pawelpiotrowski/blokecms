import { Component, Input } from '@angular/core';

@Component({
  selector: 'admin-page-with-child-drawer-layout',
  templateUrl: './page-with-child-drawer-layout.component.html',
  styleUrls: ['./page-with-child-drawer-layout.component.scss'],
})
export class PageWithChildDrawerLayoutComponent {
  @Input() loading!: boolean;
  @Input() activateDrawer!: boolean;
  @Input() drawerPercentageWidth = 'calc(50% - 16px)';
  @Input() pageCreateNewButtonLabel!: string;
  @Input() pageCreateNewButtonRoute!: string;
}
