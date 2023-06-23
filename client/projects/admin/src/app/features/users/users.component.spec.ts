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
import { BehaviorSubject, Subject } from 'rxjs';
import { GetUsersGQL, DeleteUserGQL, LoggerService } from 'shared-lib';
import { UsersComponent } from './users.component';
import { AdminAuthUser } from '../../auth/admin-auth.interface';
import { AdminAuthRepository } from '../../auth/admin-auth.repository';
import { appDisplaySuccessMessage } from '../../app.actions';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let router: Router;
  let logger: LoggerService;
  let deleteUserGql: DeleteUserGQL;
  let actions: Actions;
  const usersSource$ = new Subject();
  const mockUsersSourceRefetch = jest.fn().mockResolvedValue([]);
  const mockUsersSource = {
    watch: jest.fn().mockReturnValue({
      valueChanges: usersSource$.asObservable(),
      refetch: mockUsersSourceRefetch,
    }),
  };
  const deleteUserSource$ = new Subject();
  const mockDeleteUserSource = {
    mutate: jest.fn().mockReturnValue(deleteUserSource$.asObservable()),
  };
  const user$ = new BehaviorSubject<AdminAuthUser>(null);
  const mockAdminAuthRepository = {
    user$,
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
      declarations: [UsersComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        ApolloTestingModule,
      ],
      providers: [
        { provide: GetUsersGQL, useValue: mockUsersSource },
        { provide: DeleteUserGQL, useValue: mockDeleteUserSource },
        { provide: AdminAuthRepository, useValue: mockAdminAuthRepository },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: Actions, useValue: mockActions },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    router = TestBed.inject(Router);
    logger = TestBed.inject(LoggerService);
    actions = TestBed.inject(Actions);
    deleteUserGql = TestBed.inject(DeleteUserGQL);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('columns', () => {
    it('should set columns', () => {
      expect(component.columns.length).toEqual(3);
      // username column
      expect(component.columns[0].columnDef).toEqual('username');
      expect(component.columns[0].header).toEqual('User');
      expect(component.columns[0].cell({ username: 'foo' })).toEqual('foo');
      // is admin column
      expect(component.columns[1].columnDef).toEqual('isAdmin');
      expect(component.columns[1].header).toEqual('Admin');
      expect(component.columns[1].cell({ username: 'foo' })).toEqual('No');
      expect(component.columns[1].cell({ isAdmin: true })).toEqual('Yes');
      // created at column
      expect(component.columns[2].columnDef).toEqual('createdAt');
      expect(component.columns[2].header).toEqual('Created');
      const createdAt = new Date().toISOString();
      expect(component.columns[2].cell({ createdAt })).toEqual(createdAt);
    });
  });

  describe('data', () => {
    it('should be set to users source data on update', () => {
      const mockDataSourceUpdate = {
        loading: false,
        data: {
          users: [
            {
              _id: '1',
              username: 'foo',
            },
          ],
        },
      };
      router.initialNavigation();
      usersSource$.next(mockDataSourceUpdate);
      expect(component.data).toEqual(mockDataSourceUpdate.data.users);
    });

    it('should filter out current user from users source data on update', () => {
      const mockCurrentUser = {
        _id: '1',
        username: 'foo',
        isAdmin: false,
      };
      const mockDataSourceUpdate = {
        loading: false,
        data: {
          users: [
            mockCurrentUser,
            {
              _id: '2',
              username: 'bar',
            },
          ],
        },
      };
      router.initialNavigation();
      user$.next(mockCurrentUser);
      usersSource$.next(mockDataSourceUpdate);
      expect(component.data).toEqual([mockDataSourceUpdate.data.users[1]]);
    });
  });

  describe('actionEventHandler', () => {
    const mockRowAsUser = { _id: '1', username: 'bar' };

    it('should redirect to user edit view on edit action', async () => {
      jest.spyOn(router, 'navigate');
      (logger.warn as jest.Mock).mockClear();
      await component.editActionEventHandler(mockRowAsUser);

      expect(router.navigate).toHaveBeenLastCalledWith([
        '/users',
        mockRowAsUser._id,
        'edit',
      ]);
      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/users',
        mockRowAsUser._id,
      ]);
      expect(deleteUserGql.mutate).not.toHaveBeenLastCalledWith({
        id: mockRowAsUser._id,
      });
      expect(logger.warn).not.toHaveBeenLastCalledWith(
        `Users action foo not supported`,
        UsersComponent.name,
      );
    });

    it('should redirect to user view on view action', async () => {
      jest.spyOn(router, 'navigate');
      (logger.warn as jest.Mock).mockClear();
      await component.viewActionEventHandler(mockRowAsUser);

      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/users',
        mockRowAsUser._id,
        'edit',
      ]);
      expect(router.navigate).toHaveBeenLastCalledWith([
        '/users',
        mockRowAsUser._id,
      ]);
      expect(deleteUserGql.mutate).not.toHaveBeenLastCalledWith({
        id: mockRowAsUser._id,
      });
      expect(logger.warn).not.toHaveBeenLastCalledWith(
        `Users action foo not supported`,
        UsersComponent.name,
      );
    });

    it('should call mutation delete user gql service on delete action', async () => {
      jest.spyOn(router, 'navigate');
      (logger.warn as jest.Mock).mockClear();

      await component.deleteActionEventHandler(mockRowAsUser);

      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/users',
        mockRowAsUser._id,
        'edit',
      ]);
      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/users',
        mockRowAsUser._id,
      ]);
      expect(deleteUserGql.mutate).toHaveBeenLastCalledWith({
        id: mockRowAsUser._id,
      });
      expect(logger.warn).not.toHaveBeenLastCalledWith(
        `Users action foo not supported`,
        UsersComponent.name,
      );
    });

    it('should refetch users after deleting on delete action and toggle loading', fakeAsync(() => {
      component.deleteActionEventHandler(mockRowAsUser);

      expect(component.loading).toEqual(true);
      deleteUserSource$.next({ _id: '2', username: 'foo' });
      tick();
      expect(mockUsersSourceRefetch).toHaveBeenCalled();
      expect(actions.dispatch).toHaveBeenLastCalledWith(
        appDisplaySuccessMessage({
          message: `${component.entityLabel} deleted`,
        }),
      );
    }));
  });
});
