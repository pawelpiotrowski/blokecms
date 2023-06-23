import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  Article,
  GetArticlesByTitleGQL,
  GetArticlesByTitleResponse,
} from 'shared-lib';
import { SearchData, searchDialogSize } from '../../../search/search.interface';
import { SearchComponent } from '../../../search/search.component';

@Component({
  selector: 'admin-page-form-toolbar',
  templateUrl: './page-form-toolbar.component.html',
  styleUrls: ['./page-form-toolbar.component.scss'],
})
export class PageFormToolbarComponent {
  @Input() pageId!: string;
  @Input() articles!: Article[];
  @Input() expanded!: boolean;
  @Output() expandedChange = new EventEmitter<boolean>();
  @Output() searchResult = new EventEmitter<Article[]>();

  constructor(
    private dialog: MatDialog,
    private queryArticles: GetArticlesByTitleGQL,
  ) {}

  toggleExpanded() {
    this.expanded = !this.expanded;
    this.expandedChange.emit(this.expanded);
  }

  getSearchResultItemDisplay(item: Article) {
    return item.title;
  }

  openSearch() {
    this.dialog
      .open<
        SearchComponent<
          Article,
          GetArticlesByTitleResponse,
          Article,
          undefined
        >,
        SearchData<Article, GetArticlesByTitleResponse, Article, undefined>,
        Article[]
      >(SearchComponent, {
        data: this.getDialogData(),
        ...searchDialogSize,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result == null || result.length < 1) {
          return;
        }
        this.searchResult.emit(result);
      });
  }

  private queryArticlesDataTransformer(data: GetArticlesByTitleResponse) {
    return data.findArticlesByTitle;
  }

  private isSearchResultItemSelected(
    item: Article,
    resultArray: Article[],
    content: Article[],
  ) {
    return (
      [
        ...resultArray.map((result) => result._id),
        ...content.map((article) => article._id),
      ].indexOf(item._id) > -1
    );
  }

  private removeSearchResultItemSelected(
    item: Article,
    resultArray: Article[],
  ) {
    return resultArray.filter((result) => result._id !== item._id);
  }

  private getSearchResult(resultArray: Article[]) {
    return resultArray;
  }

  private queryInput(q: string) {
    return { title: q };
  }

  private getDialogData(): SearchData<
    Article,
    GetArticlesByTitleResponse,
    Article,
    undefined
  > {
    return {
      content: this.articles,
      service: this.queryArticles,
      dataQueryRef: this.queryArticlesDataTransformer,
      isSelected: this.isSearchResultItemSelected,
      removeItem: this.removeSearchResultItemSelected,
      getResult: this.getSearchResult,
      inputPlaceholder: 'Find article by title',
      inputLabel: 'Enter article title',
      resultItemDisplay: this.getSearchResultItemDisplay,
      getQueryInput: this.queryInput,
    };
  }
}
