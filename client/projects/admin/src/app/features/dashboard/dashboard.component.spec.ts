import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { AdminAuthUser } from '../../auth/admin-auth.interface';
import { AdminAuthRepository } from '../../auth/admin-auth.repository';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  const user$ = new BehaviorSubject<AdminAuthUser>(null);
  const mockAdminAuthRepository = {
    user$,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        { provide: AdminAuthRepository, useValue: mockAdminAuthRepository },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    user$.next({ isAdmin: true, username: 'Foo', _id: '1' });
    fixture.detectChanges();
  });

  describe('publicItems', () => {
    it('should return all public nav items excluding dashboard', () => {
      const itemsRoutes = component.publicItems.map((item) => item.route);

      expect(itemsRoutes.indexOf('dashboard')).toEqual(-1);
    });

    it('should return all public nav items mapped to dashboard nav items', () => {
      const item = component.publicItems[0];

      expect(item.listLabel).toEqual('View list');
      expect(item.listIcon).toEqual('list');
      expect(item.newLabel).toEqual('Add new');
      expect(item.newIcon).toEqual('add');
      expect(item.newRoute).toEqual(`${item.route}/new`);
    });
  });

  describe('adminItems', () => {
    it('should return all admin nav items excluding settings', () => {
      const itemsRoutes = component.adminItems.map((item) => item.route);

      expect(itemsRoutes.indexOf('settings')).toEqual(-1);
      expect(
        component.adminItems.every((item) => item.isAdmin === true),
      ).toEqual(true);
    });

    it('should return settings items', () => {
      const settingsNavItem = component.items.find(
        (item) => item.route === 'settings',
      );
      const { adminItems } = component;
      const navsItem = adminItems.find((item) => item.label === 'Navigations');
      const stylesItem = adminItems.find((item) => item.label === 'Styles');
      const scriptsItem = adminItems.find((item) => item.label === 'Scripts');

      expect(
        [navsItem, stylesItem, scriptsItem].every(
          (item) => item?.icon === settingsNavItem?.icon,
        ),
      ).toEqual(true);
    });
  });
});
