import { Component } from '@angular/core';
import { NavigationLink } from 'shared-lib';
import { PageContentEntityFormContentComponent } from '../../../../layout/page-content-entity-form/page-content-entity-form-content.component';
import { NavigationFormLink } from '../navigation-form.interface';

@Component({
  selector: 'admin-navigation-form-content',
  templateUrl: './navigation-form-content.component.html',
  styleUrls: ['./navigation-form-content.component.scss'],
})
export class NavigationFormContentComponent extends PageContentEntityFormContentComponent<NavigationLink> {
  removeItem(item: NavigationLink) {
    const content = [...(this.content as NavigationLink[])].filter(
      (link) => JSON.stringify(link) !== JSON.stringify(item),
    );

    this.emitContentUpdate(content);
  }

  addItem(item: NavigationFormLink) {
    const content = [...(this.content as NavigationLink[])];
    const { index, ...itemAsLink } = item;

    content.unshift(itemAsLink);
    this.emitContentUpdate(content);
  }

  updateItem(item: NavigationFormLink) {
    const content = [...(this.content as NavigationLink[])];
    const { index, ...itemAsLink } = item;

    content[index as number] = itemAsLink;
    this.emitContentUpdate(content);
  }

  getAsLinkContent(item: NavigationLink, index: number): NavigationFormLink {
    return {
      ...item,
      index,
    };
  }

  private emitContentUpdate(content: NavigationLink[]) {
    this.content = [...content];
    this.contentUpdate.emit(this.content);
  }
}
