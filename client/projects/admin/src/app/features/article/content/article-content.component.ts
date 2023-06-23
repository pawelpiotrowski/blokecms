import { Component, Input, OnInit } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import {
  ArticleContent,
  GetBlockCodeGQL,
  GetBlockCodeResponse,
  GetBlockMediaGQL,
  GetBlockMediaResponse,
  GetBlockTextGQL,
  GetBlockTextResponse,
  LoggerService,
} from 'shared-lib';

@Component({
  selector: 'admin-article-content',
  templateUrl: './article-content.component.html',
  styleUrls: ['./article-content.component.scss'],
})
export class ArticleContentComponent implements OnInit {
  @Input() content!: ArticleContent;

  data!: GetBlockTextResponse | GetBlockMediaResponse | GetBlockCodeResponse;
  error!: string;

  constructor(
    private getText: GetBlockTextGQL,
    private getMedia: GetBlockMediaGQL,
    private getCode: GetBlockCodeGQL,
    private logger: LoggerService,
  ) {}

  ngOnInit() {
    const kind = this.content.kind.toLowerCase();

    if (kind === 'text') {
      this.getText
        .fetch(...this.getDataSourceFetchArgs())
        .subscribe(this.getFetchHandler());
      return;
    }

    if (kind === 'media') {
      this.getMedia
        .fetch(...this.getDataSourceFetchArgs())
        .subscribe(this.getFetchHandler());
      return;
    }

    if (kind === 'code') {
      this.getCode
        .fetch(...this.getDataSourceFetchArgs())
        .subscribe(this.getFetchHandler());
      return;
    }

    this.error = `Error - unsupported content kind "${this.content.kind}"`;
  }

  get dataText() {
    return (this.data as GetBlockTextResponse).blockText;
  }

  get dataMedia() {
    return (this.data as GetBlockMediaResponse).blockMedia;
  }

  get dataCode() {
    return (this.data as GetBlockCodeResponse).blockCode;
  }

  private getFetchHandler() {
    return {
      next: this.setData.bind(this),
      error: this.fetchContentError.bind(this),
    };
  }

  private fetchContentError(error: Error) {
    this.error = 'Error fetching block data';
    this.logger.error(this.error, ArticleContentComponent.name, error);
  }

  private setData(
    resp: ApolloQueryResult<
      GetBlockTextResponse | GetBlockMediaResponse | GetBlockCodeResponse
    >,
  ) {
    const { data, loading, errors } = resp;

    if (data && !loading) {
      this.data = data;
    }

    if (errors) {
      this.error = 'Error fetching block data';
    }
  }

  private getDataSourceFetchArgs() {
    return [
      { input: { _id: this.content.refId } },
      { fetchPolicy: 'network-only' },
    ];
  }
}
