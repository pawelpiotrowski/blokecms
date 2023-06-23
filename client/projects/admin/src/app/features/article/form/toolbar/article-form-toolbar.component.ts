import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ArticleContent,
  BlockCode,
  BlockMedia,
  BlockText,
  BlockType,
  GetBlocksByNameGQL,
  GetBlocksByNameResponse,
} from 'shared-lib';
import { SearchComponent } from '../../../search/search.component';
import { SearchData, searchDialogSize } from '../../../search/search.interface';

@Component({
  selector: 'admin-article-form-toolbar',
  templateUrl: './article-form-toolbar.component.html',
  styleUrls: ['./article-form-toolbar.component.scss'],
})
export class ArticleFormToolbarComponent {
  @Input() articleId!: string;
  @Input() pageId!: string | null;
  @Input() content!: ArticleContent[];
  @Input() expanded!: boolean;
  @Output() expandedChange = new EventEmitter<boolean>();
  @Output() searchResult = new EventEmitter<ArticleContent[]>();

  constructor(
    private dialog: MatDialog,
    private queryBlocks: GetBlocksByNameGQL,
  ) {}

  toggleExpanded() {
    this.expanded = !this.expanded;
    this.expandedChange.emit(this.expanded);
  }

  /**
   * See: client/admin/README.md -> Query Params Handling in Edit/Create Views
   */
  getButtonLinkParams() {
    return {
      parent: 'articles',
      id: this.articleId,
      ...(this.pageId != null && { pageId: this.pageId }),
    };
  }

  getSearchResultItemDisplay(item: BlockMedia | BlockText | BlockCode) {
    return `${item.kind} : ${item.name}`;
  }

  openSearch() {
    this.dialog
      .open<
        SearchComponent<
          ArticleContent,
          GetBlocksByNameResponse,
          BlockMedia | BlockText | BlockCode,
          BlockType | undefined
        >,
        SearchData<
          ArticleContent,
          GetBlocksByNameResponse,
          BlockMedia | BlockText | BlockCode,
          BlockType | undefined
        >,
        ArticleContent[]
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

  private queryBlocksDataTransformer(data: GetBlocksByNameResponse) {
    return data.findBlocksByName;
  }

  private isSearchResultItemSelected(
    item: BlockMedia | BlockText | BlockCode,
    resultArray: Array<BlockMedia | BlockText | BlockCode>,
    content: ArticleContent[],
  ) {
    return (
      [
        ...resultArray.map((result) => result._id),
        ...content.map((content) => content.refId),
      ].indexOf(item._id) > -1
    );
  }

  private removeSearchResultItemSelected(
    item: BlockMedia | BlockText | BlockCode,
    resultArray: Array<BlockMedia | BlockText | BlockCode>,
  ) {
    return resultArray.filter((result) => result._id !== item._id);
  }

  private getSearchResultAsContent(
    resultArray: Array<BlockMedia | BlockText | BlockCode>,
  ) {
    return resultArray.map((result) => ({
      refId: result._id,
      kind: result.kind,
      __typename: (result as any).__typename,
    }));
  }

  private queryInput(q: string) {
    return { name: q };
  }

  private getDialogData(): SearchData<
    ArticleContent,
    GetBlocksByNameResponse,
    BlockMedia | BlockText | BlockCode,
    BlockType | undefined
  > {
    return {
      content: this.content,
      service: this.queryBlocks,
      dataQueryRef: this.queryBlocksDataTransformer,
      isSelected: this.isSearchResultItemSelected,
      removeItem: this.removeSearchResultItemSelected,
      getResultAsContent: this.getSearchResultAsContent,
      inputPlaceholder: 'Find block or multimedia by name',
      inputLabel: 'Enter block or multimedia name',
      resultItemDisplay: this.getSearchResultItemDisplay,
      getQueryInput: this.queryInput,
    };
  }
}
