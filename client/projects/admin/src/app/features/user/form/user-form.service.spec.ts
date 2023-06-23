import { fakeAsync, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Actions } from '@ngneat/effects-ng';
import { Subject } from 'rxjs';
import {
  LoggerService,
  CreateUserGQL,
  UpdateUserGQL,
  GetUsersGQL,
  GetUserGQL,
} from 'shared-lib';
import { UserFormService } from './user-form.service';

describe('UserFormService', () => {
  let service: UserFormService;
  let router: Router;
  let updateUser: UpdateUserGQL;

  const mockActions = {
    dispatch: jest.fn(),
  };
  const mockLoggerService = {
    error: jest.fn(),
  };
  const createUserSource$ = new Subject();
  const mockCreateUserSource = {
    mutate: jest.fn().mockReturnValue(createUserSource$.asObservable()),
  };
  const updateUserSource$ = new Subject();
  const mockUpdateUserSource = {
    mutate: jest.fn().mockReturnValue(updateUserSource$.asObservable()),
  };
  const mockGetUsers = { document: {} };
  const getUserSource$ = new Subject();
  const mockGetUserSource = {
    fetch: jest.fn().mockReturnValue(getUserSource$.asObservable()),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: Actions, useValue: mockActions },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: CreateUserGQL, useValue: mockCreateUserSource },
        { provide: UpdateUserGQL, useValue: mockUpdateUserSource },
        { provide: GetUsersGQL, useValue: mockGetUsers },
        { provide: GetUserGQL, useValue: mockGetUserSource },
        UserFormService,
      ],
    });
    service = TestBed.inject(UserFormService);
    router = TestBed.inject(Router);
    updateUser = TestBed.inject(UpdateUserGQL);
  });

  describe('createUserHandler', () => {
    const mockUserFormValue = {
      username: 'foo',
      isAdmin: false,
      password: 'bar',
      confirmPassword: 'bar',
    };
    const mockCreatedUser = {
      createUser: {
        _id: '1',
        username: 'foo',
        isAdmin: false,
      },
    };

    it('should call create user mutation', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      const createSpy = jest.spyOn(service, 'create');

      service.createUserHandler(mockUserFormValue);

      const dataMap: any = createSpy.mock.calls[0][1];
      const { confirmPassword, ...expectedInput } = mockUserFormValue;

      expect(createSpy).toHaveBeenLastCalledWith(
        expectedInput,
        expect.any(Function),
      );
      expect(dataMap({ data: mockCreatedUser })).toEqual(
        mockCreatedUser.createUser,
      );
      expect(dataMap({ data: null })).toEqual(undefined);
    }));
  });

  describe('updateUserHandler', () => {
    const mockUserFormValue = {
      username: 'bar',
      isAdmin: false,
      password: 'foo',
      confirmPassword: 'foo',
    };
    const mockUserId = '2';
    const mockUpdatedUser = {
      updateUser: {
        _id: mockUserId,
        username: 'bar',
        isAdmin: false,
      },
    };

    it('should call update user mutation', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      const updateSpy = jest.spyOn(service, 'update');

      service.updateUserHandler(mockUserFormValue, mockUserId);

      const dataMap: any = updateSpy.mock.calls[0][1];
      const { confirmPassword, ...expectedInput } = mockUserFormValue;

      expect(updateSpy).toHaveBeenLastCalledWith(
        { _id: mockUserId, ...expectedInput },
        expect.any(Function),
      );
      expect(dataMap({ data: mockUpdatedUser })).toEqual(
        mockUpdatedUser.updateUser,
      );
      expect(dataMap({ data: null })).toEqual(undefined);
    }));
  });
});
