import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { GetUserGQL } from 'shared-lib';
import { AdminAuthUser } from '../../auth/admin-auth.interface';
import { AdminAuthRepository } from '../../auth/admin-auth.repository';
import { PageEntityContentAuthorComponent } from './page-entity-content-author.component';

const getUserSource$ = new BehaviorSubject(null);
const mockGetUserSource = {
  fetch: jest.fn().mockReturnValue(getUserSource$.asObservable()),
};
const user$ = new BehaviorSubject<AdminAuthUser>(null);
const mockAdminAuthRepository = {
  user$,
};

describe('PageEntityContentAuthorComponent', () => {
  let component: PageEntityContentAuthorComponent;
  let fixture: ComponentFixture<PageEntityContentAuthorComponent>;
  let getUser: GetUserGQL;
  let adminAuthRepo: AdminAuthRepository;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageEntityContentAuthorComponent],
      providers: [
        { provide: GetUserGQL, useValue: mockGetUserSource },
        { provide: AdminAuthRepository, useValue: mockAdminAuthRepository },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PageEntityContentAuthorComponent);
    getUser = TestBed.inject(GetUserGQL);
    adminAuthRepo = TestBed.inject(AdminAuthRepository);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnChanges', () => {
    it('should fetch user when user input is not nullish', () => {
      component.ngOnChanges({});
      expect(getUser.fetch).not.toHaveBeenCalled();
      component.ngOnChanges({
        createdByUserId: {
          currentValue: null,
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true,
        },
      });
      expect(getUser.fetch).not.toHaveBeenCalled();
      const mockUser = {
        _id: '1',
        username: 'Foo',
        createdBy: '2',
      };
      component.createdByUserId = mockUser.createdBy;
      component.ngOnChanges({
        createdByUserId: {
          currentValue: mockUser.createdBy,
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true,
        },
      });
      expect(component.createdByUserId).toEqual(mockUser.createdBy);
    });
  });

  describe('setCreatedBy', () => {
    const mockUser = {
      _id: '3',
      username: 'Bar',
      createdBy: '4',
    };
    beforeEach(() => {
      component.createdByUserId = mockUser.createdBy;
    });

    it('should fetch user created by info and current user info', () => {
      jest.spyOn(adminAuthRepo.user$, 'subscribe');
      getUserSource$.next({ loading: false } as any);
      component.ngOnChanges({
        createdByUserId: {
          currentValue: mockUser.createdBy,
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true,
        },
      });
      expect(getUser.fetch).toHaveBeenLastCalledWith(
        {
          input: { _id: mockUser.createdBy },
        },
        {
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
      );
      expect(adminAuthRepo.user$.subscribe).toHaveBeenCalled();
    });

    it('should set createdByUsername to error message when get user returns error or nullish data', () => {
      getUserSource$.next({
        loading: false,
        errors: [{ error: true }],
      } as any);
      user$.next({ _id: '5', username: 'test', isAdmin: false });
      component.ngOnChanges({
        createdByUserId: {
          currentValue: mockUser.createdBy,
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true,
        },
      });
      expect(component.createdByUsername).toEqual(
        component['createdByUsernameError'],
      );
      component.createdByUsername = 'reset';
      getUserSource$.next({ loading: false, data: null } as any);
      component.ngOnChanges({
        createdByUserId: {
          currentValue: mockUser.createdBy,
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true,
        },
      });
      expect(component.createdByUsername).toEqual('Not found');

      component.createdByUsername = 'reset';
      getUserSource$.next({ loading: false, data: { user: {} } } as any);
      user$.next(null);
      component.ngOnChanges({
        createdByUserId: {
          currentValue: mockUser.createdBy,
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true,
        },
      });
      expect(component.createdByUsername).toEqual('Not found');
    });

    it('should set createdByUsername to string "You" when current user _id and createdBy are the same', () => {
      getUserSource$.next({
        loading: false,
        data: { user: { _id: mockUser.createdBy } },
      } as any);
      user$.next({
        _id: mockUser.createdBy,
        username: 'test',
        isAdmin: false,
      });
      component.ngOnChanges({
        createdByUserId: {
          currentValue: mockUser.createdBy,
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true,
        },
      });
      expect(component.createdByUsername).toEqual('You');
    });

    it('should set createdByUsername to createdBy username', () => {
      getUserSource$.next({
        loading: false,
        data: { user: { _id: mockUser.createdBy, username: 'Hello' } },
      } as any);
      user$.next({ _id: '9', username: 'test', isAdmin: false });
      component.ngOnChanges({
        createdByUserId: {
          currentValue: mockUser.createdBy,
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true,
        },
      });
      expect(component.createdByUsername).toEqual('Hello');
    });
  });

  describe('canCreateCreatedByLink', () => {
    it('should return boolean indicating if createdByUsername is a string and not a predefined username string', () => {
      component.createdByUsername = null as any;
      expect(component.canCreateCreatedByLink).toEqual(false);

      component.createdByUsername = 'foo';
      expect(component.canCreateCreatedByLink).toEqual(true);

      component.createdByUsername = 'You';
      expect(component.canCreateCreatedByLink).toEqual(false);

      component.createdByUsername = 'bar';
      expect(component.canCreateCreatedByLink).toEqual(true);

      component.createdByUsername = 'Not found';
      expect(component.canCreateCreatedByLink).toEqual(false);
    });
  });
});
