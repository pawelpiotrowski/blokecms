import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { provideEffects, provideEffectsManager } from '@ngneat/effects-ng';
import { PageContentEntityLayoutComponent } from './page-content-entity-layout.component';
import { PageEntityContentEffects } from './page-entity-content.effects';
import { PageContentConfirmDialogModule } from '../page-content-confirm-dialog/page-content-confirm-dialog.module';

@NgModule({
  declarations: [PageContentEntityLayoutComponent],
  exports: [PageContentEntityLayoutComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    PageContentConfirmDialogModule,
  ],
  providers: [
    provideEffectsManager(),
    provideEffects(PageEntityContentEffects),
  ],
})
export class PageContentEntityLayoutModule {}
