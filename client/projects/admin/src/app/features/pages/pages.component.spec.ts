import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { Router } from '@angular/router';
import { Actions } from '@ngneat/effects-ng';
import { Subject } from 'rxjs';
import { DeletePageGQL, GetPagesGQL, LoggerService } from 'shared-lib';
import { PagesComponent } from './pages.component';
import { appDisplaySuccessMessage } from '../../app.actions';

describe('PagesComponent', () => {
  let component: PagesComponent;
  let fixture: ComponentFixture<PagesComponent>;
  let router: Router;
  let logger: LoggerService;
  let deletePageGql: DeletePageGQL;
  let actions: Actions;
  const pagesSource$ = new Subject();
  const mockPagesSourceRefetch = jest.fn().mockResolvedValue([]);
  const mockPagesSource = {
    watch: jest.fn().mockReturnValue({
      valueChanges: pagesSource$.asObservable(),
      refetch: mockPagesSourceRefetch,
    }),
  };
  const deletePageSource$ = new Subject();
  const mockDeletePageSource = {
    mutate: jest.fn().mockReturnValue(deletePageSource$.asObservable()),
  };
  const mockLoggerService = {
    error: jest.fn(),
    warn: jest.fn(),
  };
  const mockActions = {
    dispatch: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagesComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        ApolloTestingModule,
      ],
      providers: [
        { provide: GetPagesGQL, useValue: mockPagesSource },
        { provide: DeletePageGQL, useValue: mockDeletePageSource },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: Actions, useValue: mockActions },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PagesComponent);
    router = TestBed.inject(Router);
    logger = TestBed.inject(LoggerService);
    actions = TestBed.inject(Actions);
    deletePageGql = TestBed.inject(DeletePageGQL);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('columns', () => {
    it('should set columns', () => {
      expect(component.columns.length).toEqual(2);
      // title column
      expect(component.columns[0].columnDef).toEqual('title');
      expect(component.columns[0].header).toEqual('Title');
      expect(component.columns[0].cell({ title: 'Foo' })).toEqual('Foo');
      // slug column
      expect(component.columns[1].columnDef).toEqual('slug');
      expect(component.columns[1].header).toEqual('Slug');
      expect(component.columns[1].cell({ slug: 'foo' })).toEqual('/foo');
    });
  });

  describe('data', () => {
    it('should be set to pages source data on update', () => {
      const mockDataSourceUpdate = {
        loading: false,
        data: {
          pages: [
            {
              _id: '1',
              title: 'Bar',
              slug: 'bar',
            },
          ],
        },
      };
      router.initialNavigation();
      pagesSource$.next(mockDataSourceUpdate);
      expect(component.data).toEqual(mockDataSourceUpdate.data.pages);
    });
  });

  describe('actionEventHandler', () => {
    const mockRowAsPage = { _id: '1' };

    it('should redirect to page edit view on edit action', async () => {
      jest.spyOn(router, 'navigate');
      (logger.warn as jest.Mock).mockClear();
      await component.editActionEventHandler(mockRowAsPage);

      expect(router.navigate).toHaveBeenLastCalledWith([
        '/pages',
        mockRowAsPage._id,
        'edit',
      ]);
      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/pages',
        mockRowAsPage._id,
      ]);
      expect(deletePageGql.mutate).not.toHaveBeenLastCalledWith({
        id: mockRowAsPage._id,
      });
      expect(logger.warn).not.toHaveBeenLastCalledWith(
        `Page action foo not supported`,
        PagesComponent.name,
      );
    });

    it('should redirect to page view on view action', async () => {
      jest.spyOn(router, 'navigate');
      (logger.warn as jest.Mock).mockClear();
      await component.viewActionEventHandler(mockRowAsPage);

      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/pages',
        mockRowAsPage._id,
        'edit',
      ]);
      expect(router.navigate).toHaveBeenLastCalledWith([
        '/pages',
        mockRowAsPage._id,
      ]);
      expect(deletePageGql.mutate).not.toHaveBeenLastCalledWith({
        id: mockRowAsPage._id,
      });
      expect(logger.warn).not.toHaveBeenLastCalledWith(
        `Page action foo not supported`,
        PagesComponent.name,
      );
    });

    it('should call mutation delete page gql service on delete action', async () => {
      jest.spyOn(router, 'navigate');
      (logger.warn as jest.Mock).mockClear();

      await component.deleteActionEventHandler(mockRowAsPage);

      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/pages',
        mockRowAsPage._id,
        'edit',
      ]);
      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/pages',
        mockRowAsPage._id,
      ]);
      expect(deletePageGql.mutate).toHaveBeenLastCalledWith({
        id: mockRowAsPage._id,
      });
      expect(logger.warn).not.toHaveBeenLastCalledWith(
        `Page action foo not supported`,
        PagesComponent.name,
      );
    });

    it('should refetch pages after deleting on delete action and toggle loading', fakeAsync(() => {
      component.deleteActionEventHandler(mockRowAsPage);

      expect(component.loading).toEqual(true);
      deletePageSource$.next({ _id: '2' });
      tick();
      expect(mockPagesSourceRefetch).toHaveBeenCalled();
      expect(actions.dispatch).toHaveBeenLastCalledWith(
        appDisplaySuccessMessage({
          message: `${component.entityLabel} deleted`,
        }),
      );
    }));
  });
});
