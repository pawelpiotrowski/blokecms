import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { filter, Subscription } from 'rxjs';
import { GetBlockNameGQL } from 'shared-lib';

@Component({
  selector: 'admin-article-form-content-name',
  templateUrl: './article-form-content-name.component.html',
  styleUrls: ['./article-form-content-name.component.scss'],
})
export class ArticleFormContentNameComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  name!: string;

  private blockNameSubscription!: Subscription;

  constructor(private getBlockName: GetBlockNameGQL) {}

  ngOnInit() {
    if (this.id == null) {
      return;
    }
    this.blockNameSubscription = this.getBlockName
      .fetch(
        { id: this.id },
        {
          fetchPolicy: 'network-only',
        },
      )

      .pipe(filter(({ loading }) => loading === false))
      .subscribe(({ data }) => {
        this.name = data.blockName;
      });
  }

  ngOnDestroy(): void {
    if (this.blockNameSubscription) {
      this.blockNameSubscription.unsubscribe();
    }
  }
}
