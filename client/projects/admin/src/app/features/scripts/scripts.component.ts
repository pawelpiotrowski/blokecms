import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from '@ngneat/effects-ng';
import {
  AllScriptsResponse,
  DeleteScriptGQL,
  GetScriptsGQL,
  LoggerService,
  Script,
} from 'shared-lib';
import {
  PageContentListColumn,
  PageContentListRow,
} from '../../layout/page-content-list-layout/page-content-list-layout.interface';
import { PageWithChildDrawerComponent } from '../../layout/page-with-child-drawer-layout/page-with-child-drawer.component';

@Component({
  selector: 'admin-scripts',
  templateUrl: './scripts.component.html',
  styleUrls: ['./scripts.component.scss'],
})
export class ScriptsComponent extends PageWithChildDrawerComponent<AllScriptsResponse> {
  data!: Script[];
  columns!: PageContentListColumn[];

  constructor(
    router: Router,
    actions: Actions,
    logger: LoggerService,
    styles: GetScriptsGQL,
    deleteScript: DeleteScriptGQL,
  ) {
    super(router, actions, logger);
    this.dataSource = styles;
    this.dataSourceDeleteItem = deleteScript;
    this.entityLabel = 'Script';
    this.dataSourceUpdateFunction = this.dataSourceUpdateHandler;
    this.setColumns();
  }

  async editActionEventHandler(event: PageContentListRow) {
    await this.redirect(['/settings/scripts', (event as Script)._id, 'edit']);
  }

  async viewActionEventHandler(event: PageContentListRow) {
    await this.redirect(['/settings/scripts', (event as Script)._id]);
  }

  deleteActionEventHandler(event: PageContentListRow) {
    this.deleteDataItem((event as Script)._id);
  }

  private dataSourceUpdateHandler(data: AllScriptsResponse) {
    this.data = data.scripts;
  }

  private setColumns() {
    this.columns = [
      {
        columnDef: 'name',
        header: 'Name',
        cell: (script) => `${(script as Script).name}`,
      },
    ];
  }
}
