import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ArticleModule } from '../article/article.module';
import { PageComponent } from './page.component';

describe('PageComponent', () => {
  let component: PageComponent;
  let fixture: ComponentFixture<PageComponent>;
  let activatedRoute: ActivatedRoute;
  let titleService: Title;
  let metaService: Meta;

  const getActivatedRouteDataSource$ = new Subject();
  const mockGetActivatedRouteDataSource = {
    data: getActivatedRouteDataSource$.asObservable(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleModule],
      declarations: [PageComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockGetActivatedRouteDataSource,
        },
        Title,
        Meta,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PageComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    titleService = TestBed.inject(Title);
    metaService = TestBed.inject(Meta);
    component = fixture.componentInstance;
  });

  it('should set page data from activated route', (done) => {
    jest.spyOn(titleService, 'setTitle');
    jest.spyOn(metaService, 'updateTag');
    const mockPageData = {
      title: 'The Page',
      _id: '123',
      articles: [{ title: 'Hello' }, { title: 'World' }],
      slug: 'page',
    };
    fixture.detectChanges();

    activatedRoute.data.subscribe(({ page }) => {
      expect(component.page.title).toEqual(page.title);
      expect(titleService.setTitle).toHaveBeenLastCalledWith(page.title);
      expect(metaService.updateTag).toHaveBeenLastCalledWith({
        name: 'keywords',
        content: 'Hello, World',
      });
      done();
    });

    getActivatedRouteDataSource$.next({ page: mockPageData });
  });
});
