import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { AdminAuthUser } from '../auth/admin-auth.interface';
import { AdminAuthRepository } from '../auth/admin-auth.repository';
import { NavComponent } from './nav.component';

@Component({
  selector: 'admin-test-nav',
  template: '<div></div>',
})
export class TestNavComponent extends NavComponent {
  constructor() {
    super(...NavComponent.deps());
  }
}

describe('NavComponent', () => {
  let component: TestNavComponent;
  let fixture: ComponentFixture<TestNavComponent>;
  let repo: AdminAuthRepository;
  const user$ = new BehaviorSubject<AdminAuthUser>(null);
  const mockAdminAuthRepository = {
    user$,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestNavComponent],
      providers: [
        { provide: AdminAuthRepository, useValue: mockAdminAuthRepository },
      ],
    }).compileComponents();
    repo = TestBed.inject(AdminAuthRepository);
    fixture = TestBed.createComponent(TestNavComponent);
    component = fixture.componentInstance;
  });

  describe('items', () => {
    it('should return empty array if user is not resolved', async () => {
      fixture.detectChanges();
      expect(component.items.length).toBe(0);
    });

    it('should return array of all items when user is resolved with admin role', async () => {
      fixture.detectChanges();
      mockAdminAuthRepository.user$.next({
        username: 'Foo',
        isAdmin: true,
        _id: '123',
      });
      expect(component.items.length).toEqual(8);
    });

    it('should return array of non admin items if user role is not admin', async () => {
      fixture.detectChanges();
      mockAdminAuthRepository.user$.next({
        username: 'Bar',
        isAdmin: false,
        _id: '321',
      });
      expect(component.items.length).toEqual(6);
    });
  });
});
