import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { filter, map, Observable, switchMap } from 'rxjs';
import { GetPagesByTitleOrSlugGQL, Page } from 'shared-lib';

export interface PageFormAutocompleteSelect extends Omit<Page, 'title'> {
  title?: string;
}

@Component({
  selector: 'admin-page-form-autocomplete',
  templateUrl: './page-form-autocomplete.component.html',
  styleUrls: ['./page-form-autocomplete.component.scss'],
})
export class PageFormAutocompleteComponent implements OnInit {
  @Input() preSelect!: PageFormAutocompleteSelect | null;
  @Output() selectedUpdate = new EventEmitter<PageFormAutocompleteSelect>();
  isEdit!: boolean;
  inputFormControl = new FormControl<string | PageFormAutocompleteSelect>('');
  selected!: PageFormAutocompleteSelect | null;
  filteredOptions!: Observable<PageFormAutocompleteSelect[]>;

  constructor(private pagesQuery: GetPagesByTitleOrSlugGQL) {}

  ngOnInit() {
    this.isEdit = this.preSelect != null && this.preSelect._id.length > 0;
    this.filteredOptions = this.inputFormControl.valueChanges.pipe(
      map((value) => (typeof value === 'string' ? value : value?.slug)),
      filter((value) => value != null && value.length > 0),
      switchMap((value) =>
        this.pagesQuery
          .fetch({ arg: value })
          .pipe(filter(({ loading }) => loading === false)),
      ),
      map((resp) => {
        return resp.data.findPagesByTitleOrSlug;
      }),
    );
  }

  displayFn(page: PageFormAutocompleteSelect): string {
    return page.slug;
  }

  selectedOption(event: MatAutocompleteSelectedEvent) {
    this.selected = event.option.value;
    this.selectedUpdate.emit(this.selected as PageFormAutocompleteSelect);
  }

  autocompleteFormSubmit(event: Event) {
    event.preventDefault();
  }
}
