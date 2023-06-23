import { Component, Input } from '@angular/core';
import { Script } from 'shared-lib';

@Component({
  selector: 'admin-script-view',
  templateUrl: './script-view.component.html',
  styleUrls: ['./script-view.component.scss'],
})
export class ScriptViewComponent {
  @Input() script!: Script;
}
