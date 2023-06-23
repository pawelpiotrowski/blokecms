import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatMenuModule } from '@angular/material/menu';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Actions } from '@ngneat/effects-ng';
import { BehaviorSubject } from 'rxjs';
import { adminAuthLogout } from '../../auth/admin-auth.actions';
import { AdminAuthUser } from '../../auth/admin-auth.interface';
import { AdminAuthRepository } from '../../auth/admin-auth.repository';
import { AccountNavComponent } from './account-nav.component';

describe('AccountNavComponent', () => {
  let component: AccountNavComponent;
  let fixture: ComponentFixture<AccountNavComponent>;
  let actions: Actions;
  let repo: AdminAuthRepository;
  let loader: HarnessLoader;
  const user$ = new BehaviorSubject<AdminAuthUser>(null);

  const mockActions = {
    dispatch: jest.fn(),
  };
  const mockAdminAuthRepository = {
    user$,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountNavComponent],
      imports: [MatMenuModule, NoopAnimationsModule],
      providers: [
        { provide: Actions, useValue: mockActions },
        { provide: AdminAuthRepository, useValue: mockAdminAuthRepository },
      ],
    }).compileComponents();
    repo = TestBed.inject(AdminAuthRepository);
    actions = TestBed.inject(Actions);
    fixture = TestBed.createComponent(AccountNavComponent);
    component = fixture.componentInstance;
  });

  // skipping as harness is not working properly
  // https://github.com/angular/components/issues/21632
  // the workaround with `waitForAsync` does not work in here
  // neither any of those https://stackoverflow.com/q/63235895
  describe.skip('ngOnInit', () => {
    beforeEach(() => {
      user$.next({ username: 'test', _id: '1', isAdmin: false });
      jest.spyOn(repo.user$, 'subscribe');
      fixture.detectChanges();
      loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should load all menu triggers', async () => {
      const triggers = await loader.getAllHarnesses(MatMenuHarness);
      expect(triggers.length).toBe(1);
    });

    it('should subscribe to admin auth user', () => {
      expect(repo.user$.subscribe).toHaveBeenCalled();
    });

    it('should set menu text to icon and user name', async () => {
      const [menu] = await loader.getAllHarnesses(MatMenuHarness);
      expect(await menu.getTriggerText()).toBe('persontest');
      user$.next({ username: 'admin', _id: '2', isAdmin: true });
      expect(await menu.getTriggerText()).toBe('account_circleadmin');
    });

    it('should open and close', async () => {
      const [menu] = await loader.getAllHarnesses(MatMenuHarness);
      expect(await menu.isOpen()).toBe(false);
      await menu.open();
      expect(await menu.isOpen()).toBe(true);
      await menu.close();
      expect(await menu.isOpen()).toBe(false);
    });

    it('should get all items', async () => {
      const [menu] = await loader.getAllHarnesses(MatMenuHarness);
      await menu.open();
      expect((await menu.getItems()).length).toBe(2);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from auth repo updates', () => {
      user$.next({ username: 'test', _id: '1', isAdmin: false });
      fixture.detectChanges();
      expect(component.isAdmin).toEqual(false);
      expect(component.userName).toEqual('test');
      component.ngOnDestroy();
      user$.next({ username: 'foo', _id: '2', isAdmin: true });
      expect(component.isAdmin).not.toEqual(true);
      expect(component.userName).not.toEqual('foo');
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should dispatch adminAuthLogout action', () => {
      component.logOut();

      expect(actions.dispatch).toHaveBeenLastCalledWith(adminAuthLogout());
    });
  });
});
