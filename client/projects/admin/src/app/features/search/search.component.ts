import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QueryRef } from 'apollo-angular';
import { SearchData } from './search.interface';

@Component({
  selector: 'admin-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent<C, Q, R, T> implements OnInit {
  searchForm!: FormGroup;
  searchQuery!: QueryRef<Q>;
  searchResult: R[] = [];
  selectedResult: R[] = [];
  loading!: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) private data: SearchData<C, Q, R, T>) {}

  ngOnInit() {
    this.setHistoryPatch();
    this.setSearchForm();
    this.setSearchQuerySubscription();
  }

  select(resultItem: R) {
    this.selectedResult.unshift({ ...resultItem });
  }

  selectAll() {
    this.selectedResult = [
      ...this.searchResult.filter((result) => !this.isSelected(result)),
      ...this.selectedResult,
    ];
  }

  removeAll() {
    this.selectedResult = [];
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.searchResult.length) {
      this.selectAll();
    }
  }

  remove(resultItem: R) {
    this.selectedResult = this.data.removeItem(resultItem, this.selectedResult);
  }

  resultItem(resultItem: R) {
    return this.data.resultItemDisplay(resultItem);
  }

  isSelected(resultItem: R) {
    return this.data.isSelected(
      resultItem,
      this.selectedResult,
      this.data.content,
    );
  }

  get selectedResultAsContent() {
    if (typeof this.data.getResultAsContent === 'function') {
      return this.data.getResultAsContent(this.selectedResult);
    }
    return this.data.getResult!(this.selectedResult);
  }

  get inputPlaceholder() {
    return this.data.inputPlaceholder;
  }

  get inputLabel() {
    return this.data.inputLabel;
  }

  private setHistoryPatch() {
    if (history.state !== null) {
      history.pushState(null, '');
    }
  }

  private setSearchForm() {
    this.searchForm = new FormGroup({
      query: new FormControl(''),
    });

    this.searchForm.valueChanges.subscribe(() => {
      this.searchResult = [];
      this.searchQuery.refetch(
        this.data.getQueryInput(this.searchForm.value.query),
      );
    });
  }

  private setSearchQuerySubscription() {
    this.searchQuery = this.data.service.watch(
      this.data.getQueryInput(this.searchForm.value.query),
      { fetchPolicy: 'network-only' },
    );
    this.searchQuery.valueChanges.subscribe(({ data, loading }) => {
      this.loading = loading;

      if (data) {
        this.searchResult = [...this.data.dataQueryRef(data)];
      }
    });
  }
}
