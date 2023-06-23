import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaComponent } from '../media/media.component';
import { MediaModule } from '../media/media.module';
import { MediasComponent } from './medias.component';

const routes: Routes = [
  {
    path: '',
    component: MediasComponent,
    data: {
      title: 'Multimedia',
    },
    children: [
      {
        path: 'new',
        component: MediaComponent,
        data: {
          title: 'Create Multimedia',
        },
      },
      {
        path: ':id',
        component: MediaComponent,
        data: {
          title: 'View Multimedia',
        },
      },
      {
        path: ':id/edit',
        component: MediaComponent,
        data: {
          title: 'Edit Multimedia',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), MediaModule],
  exports: [RouterModule],
})
export class MediasRoutingModule {}
