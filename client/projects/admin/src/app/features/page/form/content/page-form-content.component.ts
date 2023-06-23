import { Component, Input } from '@angular/core';
import { Article } from 'shared-lib';
import { PageContentEntityFormContentComponent } from '../../../../layout/page-content-entity-form/page-content-entity-form-content.component';

@Component({
  selector: 'admin-page-form-content',
  templateUrl: './page-form-content.component.html',
  styleUrls: ['./page-form-content.component.scss'],
})
export class PageFormContentComponent extends PageContentEntityFormContentComponent<Article> {
  @Input() pageId!: string;

  removeItem(item: Article) {
    const content = [...(this.content as Article[])].filter(
      (article) => article._id !== item._id,
    );

    this.content = [...content];
    this.contentUpdate.emit(this.content);
  }
}
