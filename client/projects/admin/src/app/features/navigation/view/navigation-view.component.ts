import { Component, Input } from '@angular/core';
import { Navigation } from 'shared-lib';

@Component({
  selector: 'admin-navigation-view',
  templateUrl: './navigation-view.component.html',
  styleUrls: ['./navigation-view.component.scss'],
})
export class NavigationViewComponent {
  @Input() navigation!: Navigation;
}
