import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { GetUserGQL } from 'shared-lib';
import { AdminAuthUser } from '../../../auth/admin-auth.interface';
import { AdminAuthRepository } from '../../../auth/admin-auth.repository';
import { PageEntityContentAuthorModule } from '../../../layout/page-entity-content-author/page-entity-content-author.module';
import { UserViewComponent } from './user-view.component';

const getUserSource$ = new BehaviorSubject(null);
const mockGetUserSource = {
  fetch: jest.fn().mockReturnValue(getUserSource$.asObservable()),
};
const user$ = new BehaviorSubject<AdminAuthUser>(null);
const mockAdminAuthRepository = {
  user$,
};

describe('UserViewComponent', () => {
  let component: UserViewComponent;
  let fixture: ComponentFixture<UserViewComponent>;
  let getUser: GetUserGQL;
  let adminAuthRepo: AdminAuthRepository;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserViewComponent],
      imports: [PageEntityContentAuthorModule],
      providers: [
        { provide: GetUserGQL, useValue: mockGetUserSource },
        { provide: AdminAuthRepository, useValue: mockAdminAuthRepository },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserViewComponent);
    getUser = TestBed.inject(GetUserGQL);
    adminAuthRepo = TestBed.inject(AdminAuthRepository);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnChanges', () => {
    it('should set user created by id if user input is not nullish', () => {
      component.ngOnChanges({});
      expect(component.createdByUserId).toBeUndefined();
      component.ngOnChanges({
        user: {
          currentValue: null,
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true,
        },
      });
      expect(component.createdByUserId).toBeUndefined();
      const mockUser = {
        _id: '1',
        username: 'Foo',
        createdBy: '2',
      };
      component.user = mockUser;
      component.ngOnChanges({
        user: {
          currentValue: mockUser,
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true,
        },
      });
      expect(component.createdByUserId).toEqual(mockUser.createdBy);
    });
  });
});
