import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@ngneat/effects-ng';
import {
  DeleteScriptGQL,
  DeleteScriptResponse,
  GetScriptGQL,
  GetScriptResponse,
  Script,
} from 'shared-lib';
import { PageEntityContentRepository } from '../../layout/page-content-entity-layout/page-entity-content.repository';
import { PageWithChildDrawerChildComponent } from '../../layout/page-with-child-drawer-layout/page-with-child-drawer-child.component';
import { ScriptModel } from './script.model';

@Component({
  selector: 'admin-script',
  templateUrl: './script.component.html',
  styleUrls: ['./script.component.scss'],
})
export class ScriptComponent extends PageWithChildDrawerChildComponent<
  GetScriptResponse,
  DeleteScriptResponse
> {
  scriptData!: Script;

  constructor(
    entityRepo: PageEntityContentRepository,
    route: ActivatedRoute,
    router: Router,
    actions: Actions,
    getScript: GetScriptGQL,
    deleteScript: DeleteScriptGQL,
  ) {
    super(entityRepo, route, router, actions);
    this.dataSource = getScript;
    this.dataModel = { script: new ScriptModel() };
    this.dataSourceUpdateFunction = this.dataSourceUpdateHandler;
    this.dataDeleteSource = deleteScript;
    this.entityLabel = 'Script';
  }

  private dataSourceUpdateHandler(data: GetScriptResponse) {
    this.scriptData = data.script;
  }
}
