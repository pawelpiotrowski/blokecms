import { Component, HostBinding, Input } from '@angular/core';
import { NavComponent } from '../nav.component';

@Component({
  selector: 'admin-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent extends NavComponent {
  @HostBinding('class.horizontal') @Input() layoutHorizontal = false;

  constructor() {
    super(...NavComponent.deps());
  }
}
