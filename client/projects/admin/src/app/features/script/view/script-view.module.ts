import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScriptViewComponent } from './script-view.component';
import { CodeEditModule } from 'shared-lib';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [ScriptViewComponent],
  exports: [ScriptViewComponent],
  imports: [CommonModule, MatCardModule, CodeEditModule],
})
export class ScriptViewModule {}
