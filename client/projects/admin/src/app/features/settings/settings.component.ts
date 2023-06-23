import { Component } from '@angular/core';

@Component({
  selector: 'admin-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  tabLinks = [
    {
      label: 'Navigations',
      link: './navigations',
      index: 0,
    },
    {
      label: 'Styles',
      link: './styles',
      index: 1,
    },
    {
      label: 'Scripts',
      link: './scripts',
      index: 2,
    },
  ];
}
