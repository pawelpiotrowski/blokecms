import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScriptComponent } from './script.component';
import { PageContentEntityLayoutModule } from '../../layout/page-content-entity-layout/page-content-entity-layout.module';
import { ScriptFormModule } from './form/script-form.module';
import { ScriptViewModule } from './view/script-view.module';

@NgModule({
  declarations: [ScriptComponent],
  exports: [ScriptComponent],
  imports: [
    CommonModule,
    PageContentEntityLayoutModule,
    ScriptFormModule,
    ScriptViewModule,
  ],
})
export class ScriptModule {}
