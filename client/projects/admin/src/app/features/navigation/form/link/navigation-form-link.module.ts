import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationFormLinkComponent } from './navigation-form-link.component';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PageFormAutocompleteModule } from '../../../page/form/autocomplete/page-form-autocomplete.module';

@NgModule({
  declarations: [NavigationFormLinkComponent],
  exports: [NavigationFormLinkComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    PageFormAutocompleteModule,
  ],
})
export class NavigationFormLinkModule {}
