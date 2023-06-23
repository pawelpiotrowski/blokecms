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
import { NavigationsComponent } from './navigations.component';
import {
  DeleteNavigationGQL,
  GetNavigationsGQL,
  LoggerService,
} from 'shared-lib';
import { appDisplaySuccessMessage } from '../../app.actions';

describe('NavigationsComponent', () => {
  let component: NavigationsComponent;
  let fixture: ComponentFixture<NavigationsComponent>;
  let router: Router;
  let logger: LoggerService;
  let deleteNavigationGql: DeleteNavigationGQL;
  let actions: Actions;
  const navigationsSource$ = new Subject();
  const mockNavigationsSourceRefetch = jest.fn().mockResolvedValue([]);
  const mockNavigationsSource = {
    watch: jest.fn().mockReturnValue({
      valueChanges: navigationsSource$.asObservable(),
      refetch: mockNavigationsSourceRefetch,
    }),
  };
  const deleteNavigationSource$ = new Subject();
  const mockDeleteNavigationSource = {
    mutate: jest.fn().mockReturnValue(deleteNavigationSource$.asObservable()),
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
      declarations: [NavigationsComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        ApolloTestingModule,
      ],
      providers: [
        { provide: GetNavigationsGQL, useValue: mockNavigationsSource },
        { provide: DeleteNavigationGQL, useValue: mockDeleteNavigationSource },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: Actions, useValue: mockActions },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationsComponent);
    router = TestBed.inject(Router);
    logger = TestBed.inject(LoggerService);
    actions = TestBed.inject(Actions);
    deleteNavigationGql = TestBed.inject(DeleteNavigationGQL);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('columns', () => {
    it('should set columns', () => {
      expect(component.columns.length).toEqual(1);
      // name column
      expect(component.columns[0].columnDef).toEqual('name');
      expect(component.columns[0].header).toEqual('Name');
      expect(component.columns[0].cell({ name: 'Main nav' })).toEqual(
        'Main nav',
      );
    });
  });

  describe('data', () => {
    it('should be set to navigations source data on update', () => {
      const mockDataSourceUpdate = {
        loading: false,
        data: {
          navigations: [
            {
              _id: '1',
              name: 'nav',
            },
          ],
        },
      };
      router.initialNavigation();
      navigationsSource$.next(mockDataSourceUpdate);
      expect(component.data).toEqual(mockDataSourceUpdate.data.navigations);
    });
  });

  describe('actionEventHandler', () => {
    const mockRowAsNavigation = { _id: '1' };

    it('should redirect to navigation edit view on edit action', async () => {
      jest.spyOn(router, 'navigate');
      (logger.warn as jest.Mock).mockClear();
      await component.editActionEventHandler(mockRowAsNavigation);

      expect(router.navigate).toHaveBeenLastCalledWith([
        '/settings/navigations',
        mockRowAsNavigation._id,
        'edit',
      ]);
      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/settings/navigations',
        mockRowAsNavigation._id,
      ]);
      expect(deleteNavigationGql.mutate).not.toHaveBeenLastCalledWith({
        id: mockRowAsNavigation._id,
      });
      expect(logger.warn).not.toHaveBeenLastCalledWith(
        `Navigation action foo not supported`,
        NavigationsComponent.name,
      );
    });

    it('should redirect to navigation view on view action', async () => {
      jest.spyOn(router, 'navigate');
      (logger.warn as jest.Mock).mockClear();
      await component.viewActionEventHandler(mockRowAsNavigation);

      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/settings/navigations',
        mockRowAsNavigation._id,
        'edit',
      ]);
      expect(router.navigate).toHaveBeenLastCalledWith([
        '/settings/navigations',
        mockRowAsNavigation._id,
      ]);
      expect(deleteNavigationGql.mutate).not.toHaveBeenLastCalledWith({
        id: mockRowAsNavigation._id,
      });
      expect(logger.warn).not.toHaveBeenLastCalledWith(
        `Navigation action foo not supported`,
        NavigationsComponent.name,
      );
    });

    it('should call mutation delete navigation gql service on delete action', async () => {
      jest.spyOn(router, 'navigate');
      (logger.warn as jest.Mock).mockClear();

      await component.deleteActionEventHandler(mockRowAsNavigation);

      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/settings/navigations',
        mockRowAsNavigation._id,
        'edit',
      ]);
      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/settings/navigations',
        mockRowAsNavigation._id,
      ]);
      expect(deleteNavigationGql.mutate).toHaveBeenLastCalledWith({
        id: mockRowAsNavigation._id,
      });
      expect(logger.warn).not.toHaveBeenLastCalledWith(
        `Navigation action foo not supported`,
        NavigationsComponent.name,
      );
    });

    it('should refetch navigations after deleting on delete action and toggle loading', fakeAsync(() => {
      component.deleteActionEventHandler(mockRowAsNavigation);

      expect(component.loading).toEqual(true);
      deleteNavigationSource$.next({ _id: '2' });
      tick();
      expect(mockNavigationsSourceRefetch).toHaveBeenCalled();
      expect(actions.dispatch).toHaveBeenLastCalledWith(
        appDisplaySuccessMessage({
          message: `${component.entityLabel} deleted`,
        }),
      );
    }));
  });
});
