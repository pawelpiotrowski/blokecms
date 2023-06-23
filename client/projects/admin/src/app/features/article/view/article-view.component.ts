import { Component, Input } from '@angular/core';
import { Article } from 'shared-lib';

@Component({
  selector: 'admin-article-view',
  templateUrl: './article-view.component.html',
  styleUrls: ['./article-view.component.scss'],
})
export class ArticleViewComponent {
  @Input() article!: Article;
}
