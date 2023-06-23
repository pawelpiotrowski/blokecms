import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlockComponent } from '../block/block.component';
import { BlockModule } from '../block/block.module';
import { BlocksComponent } from './blocks.component';

const routes: Routes = [
  {
    path: '',
    component: BlocksComponent,
    data: {
      title: 'Blocks',
    },
    children: [
      {
        path: 'new',
        component: BlockComponent,
        data: {
          title: 'Create Block',
        },
      },
      {
        path: ':id',
        component: BlockComponent,
        data: {
          title: 'View Block',
        },
      },
      {
        path: ':id/edit',
        component: BlockComponent,
        data: {
          title: 'Edit Block',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), BlockModule],
  exports: [RouterModule],
})
export class BlocksRoutingModule {}
