import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, Subject } from 'rxjs';
import { DeleteScriptGQL, GetScriptGQL } from 'shared-lib';
import {
  PageWithChildDrawerActivatedRouteMock,
  getPageWithChildDrawerActivatedRouteMockClone,
} from '../../../../test/activated-route.mock';
import { PageContentEntityToolbarButtonAction } from '../../layout/page-content-entity-layout/page-content-entity-layout.interface';
import { PageEntityContentRepository } from '../../layout/page-content-entity-layout/page-entity-content.repository';
import { ScriptComponent } from './script.component';
import { ScriptModel } from './script.model';

describe('ScriptComponent', () => {
  let component: ScriptComponent;
  let fixture: ComponentFixture<ScriptComponent>;
  let router: Router;
  const getScriptSource$ = new Subject();
  const mockGetScriptSource = {
    fetch: jest.fn().mockReturnValue(getScriptSource$.asObservable()),
  };
  const deleteScriptSource$ = new Subject();
  const mockDeleteScriptSource = {
    mutate: jest.fn().mockReturnValue(deleteScriptSource$.asObservable()),
  };
  const buttonsAction$ =
    new BehaviorSubject<PageContentEntityToolbarButtonAction>(null);
  const mockEntityRepository = {
    buttonsAction$,
  };
  let mockActivatedRoute: PageWithChildDrawerActivatedRouteMock;

  beforeEach(async () => {
    mockActivatedRoute = getPageWithChildDrawerActivatedRouteMockClone();
    await TestBed.configureTestingModule({
      declarations: [ScriptComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'new',
            component: ScriptComponent,
            data: {
              title: 'Create Script',
            },
          },
          {
            path: ':id',
            component: ScriptComponent,
            data: {
              title: 'View Script',
            },
          },
          {
            path: ':id/edit',
            component: ScriptComponent,
            data: {
              title: 'Edit Script',
            },
          },
        ]),
      ],
      providers: [
        { provide: GetScriptGQL, useValue: mockGetScriptSource },
        { provide: DeleteScriptGQL, useValue: mockDeleteScriptSource },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        {
          provide: PageEntityContentRepository,
          useValue: mockEntityRepository,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ScriptComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  describe('scriptData', () => {
    it('should be set to script model when view type is "new"', async () => {
      mockActivatedRoute.snapshot.params = {} as any;

      await router.navigate(['/new']);

      fixture.detectChanges();
      const scriptModel = new ScriptModel();

      expect(component.scriptData).toEqual(scriptModel);
    });

    it('should be set to script data when view type is NOT "new"', async () => {
      await router.navigate(['/123', 'edit']);

      fixture.detectChanges();
      const mockDataSourceUpdate = {
        loading: false,
        data: {
          script: {
            _id: '123',
          },
        },
      };

      getScriptSource$.next(mockDataSourceUpdate);
      expect(component.scriptData).toEqual(mockDataSourceUpdate.data.script);
    });
  });
});
