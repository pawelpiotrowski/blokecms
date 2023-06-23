import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import {
  ApiService,
  GetArticlesCountGQL,
  GetBlocksCodeCountGQL,
  GetBlocksMediaCountGQL,
  GetBlocksTextCountGQL,
  GetPagesCountGQL,
} from 'shared-lib';
import { DashboardInsightsComponent } from './dashboard-insights.component';

const mockPublicLinks = [
  {
    label: 'Pages',
    route: 'pages',
    icon: 'web',
    refId: 'pages',
    listLabel: 'View list',
    listIcon: 'list',
    newLabel: 'Add new',
    newIcon: 'add',
    newRoute: 'pages/new',
  },
  {
    label: 'Articles',
    route: 'articles',
    icon: 'article',
    refId: 'articles',
    listLabel: 'View list',
    listIcon: 'list',
    newLabel: 'Add new',
    newIcon: 'add',
    newRoute: 'articles/new',
  },
  {
    label: 'Blocks',
    route: 'blocks',
    icon: 'short_text',
    refId: 'blocks',
    listLabel: 'View list',
    listIcon: 'list',
    newLabel: 'Add new',
    newIcon: 'add',
    newRoute: 'blocks/new',
  },
  {
    label: 'Code Blocks',
    route: 'code-blocks',
    icon: 'code_blocks',
    refId: 'codeBlocks',
    listLabel: 'View list',
    listIcon: 'list',
    newLabel: 'Add new',
    newIcon: 'add',
    newRoute: 'code-blocks/new',
  },
  {
    label: 'Multimedia',
    route: 'multimedia',
    icon: 'perm_media',
    refId: 'media',
    listLabel: 'View list',
    listIcon: 'list',
    newLabel: 'Add new',
    newIcon: 'add',
    newRoute: 'multimedia/new',
  },
];

describe('DashboardInsightsComponent', () => {
  let component: DashboardInsightsComponent;
  let fixture: ComponentFixture<DashboardInsightsComponent>;
  let apiService: ApiService;
  let pagesCountService: GetPagesCountGQL;
  let articlesCountService: GetArticlesCountGQL;
  let blocksTextCountService: GetBlocksTextCountGQL;
  let blocksCodeCountService: GetBlocksCodeCountGQL;
  let blocksMediaCountService: GetBlocksMediaCountGQL;
  const mockedVersion = 'f.o.o';
  const mockApiService = {
    version: jest.fn().mockReturnValue(of({ version: 'f.o.o' })),
  };
  const pagesCountSource$ = new Subject();
  const mockPagesCountSource = {
    fetch: jest.fn().mockReturnValue(pagesCountSource$.asObservable()),
  };
  const articlesCountSource$ = new Subject();
  const mockArticlesCountSource = {
    fetch: jest.fn().mockReturnValue(articlesCountSource$.asObservable()),
  };
  const blocksTextCountSource$ = new Subject();
  const mockBlocksTextCountCountSource = {
    fetch: jest.fn().mockReturnValue(blocksTextCountSource$.asObservable()),
  };
  const blocksCodeCountSource$ = new Subject();
  const mockBlocksCodeCountCountSource = {
    fetch: jest.fn().mockReturnValue(blocksCodeCountSource$.asObservable()),
  };
  const blocksMediaCountSource$ = new Subject();
  const mockBlocksMediaCountCountSource = {
    fetch: jest.fn().mockReturnValue(blocksMediaCountSource$.asObservable()),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardInsightsComponent],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: GetPagesCountGQL, useValue: mockPagesCountSource },
        { provide: GetArticlesCountGQL, useValue: mockArticlesCountSource },
        {
          provide: GetBlocksTextCountGQL,
          useValue: mockBlocksTextCountCountSource,
        },
        {
          provide: GetBlocksCodeCountGQL,
          useValue: mockBlocksCodeCountCountSource,
        },
        {
          provide: GetBlocksMediaCountGQL,
          useValue: mockBlocksMediaCountCountSource,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardInsightsComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
  });

  describe('version$', () => {
    it('should fetch and show api version', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const versionDomElement = compiled.querySelector(
        '[data-testid="dashboard-insights-version"]',
      );

      expect(versionDomElement?.textContent).toEqual(mockedVersion);
    });
  });

  describe('insightsLinks', () => {
    it('should fetch pages, articles, all blocks and media count and display as links', () => {
      component.publicLinks = mockPublicLinks;
      expect(component.insightsLinksResolved).toEqual(false);
      fixture.detectChanges();

      pagesCountSource$.next({ data: { pagesCount: 1 }, loading: false });
      articlesCountSource$.next({
        data: { articlesCount: 10 },
        loading: false,
      });
      blocksTextCountSource$.next({
        data: { blocksTextCount: 27 },
        loading: false,
      });
      blocksCodeCountSource$.next({
        data: { blocksCodeCount: 2 },
        loading: false,
      });
      blocksMediaCountSource$.next({
        data: { blocksMediaCount: 20 },
        loading: false,
      });
      expect(component.insightsLinksResolved).toEqual(true);
      expect(component.insightsLinks.length).toEqual(5);

      const findPageInsightsLink = component.insightsLinks.find(
        (l) => l.url === 'pages',
      );
      const findArticleInsightsLink = component.insightsLinks.find(
        (l) => l.url === 'articles',
      );
      const findBlockTextInsightsLink = component.insightsLinks.find(
        (l) => l.url === 'blocks',
      );
      const findBlockCodeInsightsLink = component.insightsLinks.find(
        (l) => l.url === 'code-blocks',
      );
      const findMediaInsightsLink = component.insightsLinks.find(
        (l) => l.url === 'multimedia',
      );
      expect(findPageInsightsLink?.label).toEqual('page');
      expect(findPageInsightsLink?.count).toEqual(1);
      expect(findPageInsightsLink?.url).toEqual(mockPublicLinks[0].route);
      expect(findArticleInsightsLink?.label).toEqual('articles');
      expect(findArticleInsightsLink?.count).toEqual(10);
      expect(findArticleInsightsLink?.url).toEqual(mockPublicLinks[1].route);
      expect(findBlockTextInsightsLink?.label).toEqual('blocks');
      expect(findBlockTextInsightsLink?.count).toEqual(27);
      expect(findBlockTextInsightsLink?.url).toEqual(mockPublicLinks[2].route);
      expect(findBlockCodeInsightsLink?.label).toEqual('code blocks');
      expect(findBlockCodeInsightsLink?.count).toEqual(2);
      expect(findBlockCodeInsightsLink?.url).toEqual(mockPublicLinks[3].route);
      expect(findMediaInsightsLink?.label).toEqual('multimedia');
      expect(findMediaInsightsLink?.count).toEqual(20);
      expect(findMediaInsightsLink?.url).toEqual(mockPublicLinks[4].route);
    });
  });
});
