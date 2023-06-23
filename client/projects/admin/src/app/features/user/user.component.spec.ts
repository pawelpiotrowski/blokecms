import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, Subject } from 'rxjs';
import { DeleteUserGQL, GetUserGQL } from 'shared-lib';
import {
  PageWithChildDrawerActivatedRouteMock,
  getPageWithChildDrawerActivatedRouteMockClone,
} from '../../../../test/activated-route.mock';
import { PageContentEntityToolbarButtonAction } from '../../layout/page-content-entity-layout/page-content-entity-layout.interface';
import { PageEntityContentRepository } from '../../layout/page-content-entity-layout/page-entity-content.repository';
import { UserComponent } from './user.component';
import { UserModel } from './user.model';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let router: Router;
  const getUserSource$ = new Subject();
  const mockGetUserSource = {
    fetch: jest.fn().mockReturnValue(getUserSource$.asObservable()),
  };
  const deleteUserSource$ = new Subject();
  const mockDeleteUserSource = {
    mutate: jest.fn().mockReturnValue(deleteUserSource$.asObservable()),
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
      declarations: [UserComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'new',
            component: UserComponent,
            data: {
              title: 'Create User',
            },
          },
          {
            path: ':id',
            component: UserComponent,
            data: {
              title: 'View User',
            },
          },
          {
            path: ':id/edit',
            component: UserComponent,
            data: {
              title: 'Edit User',
            },
          },
        ]),
      ],
      providers: [
        { provide: GetUserGQL, useValue: mockGetUserSource },
        { provide: DeleteUserGQL, useValue: mockDeleteUserSource },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        {
          provide: PageEntityContentRepository,
          useValue: mockEntityRepository,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
  });

  describe('userData', () => {
    it('should be set to user model when view type is "new"', async () => {
      mockActivatedRoute.snapshot.params = {} as any;

      await router.navigate(['/new']);

      fixture.detectChanges();
      const userModel = new UserModel();

      expect(component.userData).toEqual(userModel);
      expect(component.username).toEqual(userModel.username);
    });

    it('should be set to user data when view type is NOT "new"', async () => {
      await router.navigate(['/123', 'edit']);

      fixture.detectChanges();
      const mockDataSourceUpdate = {
        loading: false,
        data: {
          user: {
            _id: '123',
            username: 'foo',
          },
        },
      };

      getUserSource$.next(mockDataSourceUpdate);
      expect(component.userData).toEqual(mockDataSourceUpdate.data.user);
      expect(component.username).toEqual(
        mockDataSourceUpdate.data.user.username,
      );
    });
  });
});
