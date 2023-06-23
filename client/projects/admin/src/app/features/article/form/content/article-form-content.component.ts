import { Component, Input } from '@angular/core';
import { ArticleContent } from 'shared-lib';
import { PageContentEntityFormContentComponent } from '../../../../layout/page-content-entity-form/page-content-entity-form-content.component';

interface ContentMap {
  text: string;
  media: string;
  code: string;
}

@Component({
  selector: 'admin-article-form-content',
  templateUrl: './article-form-content.component.html',
  styleUrls: ['./article-form-content.component.scss'],
})
export class ArticleFormContentComponent extends PageContentEntityFormContentComponent<ArticleContent> {
  @Input() articleId!: string;
  @Input() pageId!: string | null;

  private readonly contentIconMap: ContentMap = {
    text: 'short_text',
    media: 'perm_media',
    code: 'code_blocks',
  };
  private readonly contentLabelMap: ContentMap = {
    text: 'Block',
    media: 'Multimedia',
    code: 'Code Block',
  };
  private readonly contentLinkMap: ContentMap = {
    text: '/blocks',
    media: '/multimedia',
    code: '/code-blocks',
  };

  getContentIcon(kind: string) {
    return this.contentIconMap[kind.toLowerCase() as keyof ContentMap];
  }

  getContentLabel(kind: string) {
    return this.contentLabelMap[kind.toLowerCase() as keyof ContentMap];
  }

  getContentLink(item: ArticleContent) {
    return [
      this.contentLinkMap[item.kind.toLowerCase() as keyof ContentMap],
      item.refId,
      'edit',
    ];
  }

  /**
   * See: client/admin/README.md -> Query Params Handling in Edit/Create Views
   */
  getContentLinkParams() {
    return {
      parent: 'articles',
      id: this.articleId,
      ...(this.pageId != null && { pageId: this.pageId }),
    };
  }

  removeItem(item: ArticleContent) {
    const content = [...(this.content as ArticleContent[])].filter(
      (articleContent) => articleContent.refId !== item.refId,
    );

    this.content = [...content];
    this.contentUpdate.emit(this.content);
  }
}
