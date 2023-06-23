import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { filter, map, pipe, Subscription, take, zip } from 'rxjs';
import {
  AllArticlesCountResponse,
  AllBlocksCodeCountResponse,
  AllBlocksMediaCountResponse,
  AllBlocksTextCountResponse,
  AllPagesCountResponse,
  ApiService,
  GetArticlesCountGQL,
  GetBlocksCodeCountGQL,
  GetBlocksMediaCountGQL,
  GetBlocksTextCountGQL,
  GetPagesCountGQL,
} from 'shared-lib';
import { DashboardNavItem } from '../dashboard.component';
import {
  DashboardInsightsCountAndLabelDto,
  DashboardInsightsLink,
  DashboardInsightsZipResponse,
  DashboardInsightsZipResponseData,
} from './dashboard-insights.interface';

@Component({
  selector: 'admin-dashboard-insights',
  templateUrl: './dashboard-insights.component.html',
  styleUrls: ['./dashboard-insights.component.scss'],
})
export class DashboardInsightsComponent implements OnInit, OnDestroy {
  @Input() publicLinks!: DashboardNavItem[];

  insightsLinks: DashboardInsightsLink[] = [];
  insightsLinksResolved = false;
  readonly version$ = this.api.version();

  private zipSubscription!: Subscription;
  private readonly countResponsesMap = {
    pagesCount: {
      handler: this.getPagesCountAndSingular.bind(this),
      linkRefId: 'pages',
    },
    articlesCount: {
      handler: this.getArticlesCountAndSingular.bind(this),
      linkRefId: 'articles',
    },
    blocksTextCount: {
      handler: this.getBlocksTextCountAndSingular.bind(this),
      linkRefId: 'blocks',
    },
    blocksCodeCount: {
      handler: this.getBlocksCodeCountAndSingular.bind(this),
      linkRefId: 'codeBlocks',
    },
    blocksMediaCount: {
      handler: this.getBlocksMediaCountAndSingular.bind(this),
      linkRefId: 'media',
    },
  };

  constructor(
    private api: ApiService,
    private pagesCountService: GetPagesCountGQL,
    private articlesCountService: GetArticlesCountGQL,
    private blocksTextCountService: GetBlocksTextCountGQL,
    private blocksCodeCountService: GetBlocksCodeCountGQL,
    private blocksMediaCountService: GetBlocksMediaCountGQL,
  ) {}

  ngOnInit(): void {
    this.zipSubscription = zip(
      this.pagesCountService
        .fetch()
        .pipe(this.countPipe<AllPagesCountResponse>()),
      this.articlesCountService
        .fetch()
        .pipe(this.countPipe<AllArticlesCountResponse>()),
      this.blocksTextCountService
        .fetch()
        .pipe(this.countPipe<AllBlocksTextCountResponse>()),
      this.blocksCodeCountService
        .fetch()
        .pipe(this.countPipe<AllBlocksCodeCountResponse>()),
      this.blocksMediaCountService
        .fetch()
        .pipe(this.countPipe<AllBlocksMediaCountResponse>()),
    )
      .pipe(take(1))
      .subscribe(this.zipCountResponseHandler.bind(this));
  }

  ngOnDestroy() {
    if (this.zipSubscription instanceof Subscription) {
      this.zipSubscription.unsubscribe();
    }
  }

  private zipCountResponseHandler(zipped: DashboardInsightsZipResponse) {
    zipped.forEach((item) => {
      // from each payload extract first key
      // this is based on assumption that payload looks like this:
      // `{ payloadCount: 11 }`
      // the keyt is then used to map handler
      const itemKey = Object.keys(
        item,
      )[0] as keyof typeof this.countResponsesMap;
      // get linkRefId to find publicLink associated with payload
      const itemLinkRefId = this.countResponsesMap[itemKey].linkRefId;
      const publicLink = this.publicLinks.find(
        (link) => link.refId === itemLinkRefId,
      ) as DashboardNavItem;
      // get public link url
      const url = publicLink.route || '';
      // call handler to extract data count and some metadata
      const { count, singular, forceSingular } =
        this.countResponsesMap[itemKey].handler(item);
      const hasPlural = forceSingular === true ? false : undefined;
      const label = this.countStr(count, singular, hasPlural);

      this.insightsLinks.push({ count, url, label });
    });

    this.insightsLinksResolved = true;
  }

  private getPagesCountAndSingular(
    data: DashboardInsightsZipResponseData,
  ): DashboardInsightsCountAndLabelDto {
    data = data as AllPagesCountResponse;

    return {
      count: data.pagesCount,
      singular: 'page',
    };
  }

  private getArticlesCountAndSingular(
    data: DashboardInsightsZipResponseData,
  ): DashboardInsightsCountAndLabelDto {
    data = data as AllArticlesCountResponse;

    return {
      count: data.articlesCount,
      singular: 'article',
    };
  }

  private getBlocksTextCountAndSingular(
    data: DashboardInsightsZipResponseData,
  ): DashboardInsightsCountAndLabelDto {
    data = data as AllBlocksTextCountResponse;

    return {
      count: data.blocksTextCount,
      singular: 'block',
    };
  }

  private getBlocksCodeCountAndSingular(
    data: DashboardInsightsZipResponseData,
  ): DashboardInsightsCountAndLabelDto {
    data = data as AllBlocksCodeCountResponse;

    return {
      count: data.blocksCodeCount,
      singular: 'code block',
    };
  }

  private getBlocksMediaCountAndSingular(
    data: DashboardInsightsZipResponseData,
  ): DashboardInsightsCountAndLabelDto {
    data = data as AllBlocksMediaCountResponse;

    return {
      count: data.blocksMediaCount,
      singular: 'multimedia',
      forceSingular: true,
    };
  }

  private countPipe<D>() {
    return pipe(
      filter(({ loading }: ApolloQueryResult<D>) => loading === false),
      map((resp: ApolloQueryResult<D>) => resp.data),
    );
  }

  private countStr(count: number, singular: string, hasPlural = true) {
    return `${singular}${count === 1 || !hasPlural ? '' : 's'}`;
  }
}
