import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { GetNavigationGQL } from 'shared-lib';
import { NavigationComponent } from './navigation.component';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let getNavigation: GetNavigationGQL;

  const getNavigationSource$ = new BehaviorSubject<any>(null);
  const mockGetNavigationSource = {
    fetch: jest.fn().mockReturnValue(getNavigationSource$.asObservable()),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [NavigationComponent],
      providers: [
        { provide: GetNavigationGQL, useValue: mockGetNavigationSource },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationComponent);
    getNavigation = TestBed.inject(GetNavigationGQL);
    component = fixture.componentInstance;
  });

  it('should get main navigation and display links', () => {
    getNavigationSource$.next({
      loading: false,
      data: {
        navigation: {
          name: 'main',
          _id: '123',
          links: [
            {
              label: 'Home',
              slug: 'home',
              pageId: '345678',
            },
            {
              label: 'Foo',
              url: 'https://foo',
            },
          ],
        },
      },
    });
    fixture.detectChanges();

    expect(getNavigation.fetch).toHaveBeenLastCalledWith({
      input: { name: 'main' },
    });

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('nav a').length).toEqual(2);
  });
});
