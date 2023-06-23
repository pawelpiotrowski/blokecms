import { Component, Input } from '@angular/core';
import { PageArticlePublic } from 'shared-lib';

@Component({
  selector: 'public-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {
  @Input() article!: PageArticlePublic;
}
