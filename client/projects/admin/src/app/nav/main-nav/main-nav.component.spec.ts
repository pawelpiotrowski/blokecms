import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { AdminAuthUser } from '../../auth/admin-auth.interface';
import { AdminAuthRepository } from '../../auth/admin-auth.repository';

import { MainNavComponent } from './main-nav.component';

describe('MainNavComponent', () => {
  let component: MainNavComponent;
  let fixture: ComponentFixture<MainNavComponent>;
  let repo: AdminAuthRepository;
  const user$ = new BehaviorSubject<AdminAuthUser>(null);
  const mockAdminAuthRepository = {
    user$,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainNavComponent],
      providers: [
        { provide: AdminAuthRepository, useValue: mockAdminAuthRepository },
      ],
    }).compileComponents();

    repo = TestBed.inject(AdminAuthRepository);
    fixture = TestBed.createComponent(MainNavComponent);
    component = fixture.componentInstance;
  });

  it('should add "horizontal" css class based on input', () => {
    fixture.detectChanges();
    const compiled: HTMLElement = fixture.debugElement.nativeElement;

    expect(compiled.classList.contains('horizontal')).toEqual(false);
    component.layoutHorizontal = true;
    fixture.detectChanges();
    expect(compiled.classList.contains('horizontal')).toEqual(true);
  });

  describe('ngOnInit', () => {
    it('should subscribe to admin auth user', () => {
      user$.next({ username: 'test', _id: '1', isAdmin: false });
      jest.spyOn(repo.user$, 'subscribe');
      fixture.detectChanges();
      expect(repo.user$.subscribe).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from auth repo updates', () => {
      user$.next({ username: 'test', _id: '1', isAdmin: false });
      fixture.detectChanges();
      expect(component.isAdmin).toEqual(false);
      component.ngOnDestroy();
      user$.next({ username: 'foo', _id: '2', isAdmin: true });
      expect(component.isAdmin).not.toEqual(true);
    });
  });
});
