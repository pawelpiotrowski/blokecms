import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PagePublic } from 'shared-lib';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'public-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnInit {
  page!: PagePublic;

  constructor(
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ page }) => {
      this.page = page;
      this.titleService.setTitle(this.page.title);
      this.metaService.updateTag({
        name: 'keywords',
        content: this.page.articles
          .map((article) => article.title.split(' ')[0])
          .join(', '),
      });
    });
  }
}
