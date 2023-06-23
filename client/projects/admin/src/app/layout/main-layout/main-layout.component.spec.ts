import { Component } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { AdminAuthUser } from '../../auth/admin-auth.interface';
import { AdminAuthRepository } from '../../auth/admin-auth.repository';
import { AccountNavModule } from '../../nav/account-nav/account-nav.module';
import { MainLayoutComponent } from './main-layout.component';

@Component({
  template: `Component 1`,
})
export class OneComponent {}

@Component({
  template: `Component 2`,
})
export class TwoComponent {}

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;
  let router: Router;
  let repo: AdminAuthRepository;
  const user$ = new BehaviorSubject<AdminAuthUser>(null);
  const mockAdminAuthRepository = {
    user$,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainLayoutComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'one', component: OneComponent },
          { path: 'two', component: TwoComponent, data: { title: 'Test' } },
        ]),
        MatToolbarModule,
        AccountNavModule,
      ],
      providers: [
        { provide: AdminAuthRepository, useValue: mockAdminAuthRepository },
      ],
    }).compileComponents();
    router = TestBed.inject(Router);
    repo = TestBed.inject(AdminAuthRepository);
  });

  describe('ngOnInit', () => {
    let logoCharacter = '';
    beforeEach(() => {
      jest.spyOn(repo.user$, 'subscribe');
      fixture = TestBed.createComponent(MainLayoutComponent);
      router.initialNavigation();
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should generate random logoCharacter 1', () => {
      expect(component.logoCharacter).not.toEqual(logoCharacter);
      expect(component.logoCharacter.length).toEqual(1);
      expect(
        component['characters'].indexOf(component.logoCharacter),
      ).toBeGreaterThanOrEqual(0);
      logoCharacter = component.logoCharacter;
    });
    // TODO it fails randomly on CI
    it.skip('should generate random logoCharacter 2', () => {
      expect(component.logoCharacter).not.toEqual(logoCharacter);
      expect(
        component['characters'].indexOf(component.logoCharacter),
      ).toBeGreaterThanOrEqual(0);
    });

    it('should subscribe to admin auth user', () => {
      expect(repo.user$.subscribe).toHaveBeenCalled();
    });
  });

  describe('isLoggedIn', () => {
    describe('when admin auth repo user is null', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(MainLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      it('should be set to false', () => {
        expect(component.isLoggedIn).toEqual(false);
      });
    });

    describe('when admin auth repo user is NOT null', () => {
      beforeEach(() => {
        user$.next({ _id: '1', username: 'foo', isAdmin: false });
        fixture = TestBed.createComponent(MainLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      it('should be set to true', () => {
        expect(component.isLoggedIn).toEqual(true);
      });
    });
  });

  describe('title', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(MainLayoutComponent);
      router.initialNavigation();
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should set title to route data title otherwise empty string', fakeAsync(() => {
      expect(component.title).toEqual('');
      router.navigate(['/two']);
      tick();
      expect(component.title).toEqual('Test');
    }));
  });
});
