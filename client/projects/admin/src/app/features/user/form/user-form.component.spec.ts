import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import {
  PageContentEntityToolbarButtonAction,
  PageContentEntityToolbarButtons,
} from '../../../layout/page-content-entity-layout/page-content-entity-layout.interface';
import { PageEntityContentRepository } from '../../../layout/page-content-entity-layout/page-entity-content.repository';
import { UserFormComponent } from './user-form.component';
import { UserFormService } from './user-form.service';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let userFormService: UserFormService;
  let entityRepo: PageEntityContentRepository;
  let formBuilder: FormBuilder;

  const buttonsAction$ =
    new BehaviorSubject<PageContentEntityToolbarButtonAction>(null);
  const mockEntityRepository = {
    buttonsAction$,
  };
  const mockUserFormService = {
    toggleSaveButton: jest.fn(),
    toggleResetButton: jest.fn(),
    updateUserHandler: jest.fn(),
    createUserHandler: jest.fn(),
  };
  const mockUserEdit = { _id: '1', username: 'foo', isAdmin: true };
  const mockUserNew = { _id: '', username: '', isAdmin: false };
  const mockUserChange = (isNew: boolean) => ({
    user: {
      previousValue: undefined,
      currentValue: isNew ? mockUserNew : mockUserEdit,
      isFirstChange: () => true,
      firstChange: true,
    },
  });
  const mockUserChangeEdit = mockUserChange(false);
  const mockUserChangeNew = mockUserChange(true);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: PageEntityContentRepository,
          useValue: mockEntityRepository,
        },
        { provide: UserFormService, useValue: mockUserFormService },
      ],
    })
      .overrideComponent(UserFormComponent, {
        set: {
          providers: [
            { provide: UserFormService, useValue: mockUserFormService },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    userFormService = TestBed.inject(UserFormService);
    entityRepo = TestBed.inject(PageEntityContentRepository);
    formBuilder = TestBed.inject(FormBuilder);
    component = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should disable save and reset buttons and subscribe to entity button actions', () => {
      jest.spyOn(entityRepo.buttonsAction$, 'subscribe');
      fixture.detectChanges();
      expect(userFormService.toggleSaveButton).toHaveBeenLastCalledWith(false);
      expect(userFormService.toggleResetButton).toHaveBeenLastCalledWith(false);
      expect(entityRepo.buttonsAction$.subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnChanges', () => {
    it('should set isEdit flag based on user input and create user form', () => {
      fixture.detectChanges();

      component.user = mockUserEdit;
      component.ngOnChanges(mockUserChangeEdit);
      expect(component.isEdit).toEqual(true);

      component.user = mockUserNew;
      component.ngOnChanges(mockUserChangeNew);
      expect(component.isEdit).toEqual(false);

      expect(component.createUserForm).toBeInstanceOf(FormGroup);
      expect(component.createUserFormCtrl).toEqual(
        component.createUserForm.controls,
      );
    });

    it('should set user form validators based on isEdit flag', () => {
      jest.spyOn(formBuilder, 'group');
      fixture.detectChanges();

      component.user = mockUserEdit;
      component.ngOnChanges(mockUserChangeEdit);
      expect(formBuilder.group).toHaveBeenLastCalledWith({
        username: [
          mockUserEdit.username,
          [expect.any(Function), expect.any(Function)],
        ],
        isAdmin: mockUserEdit.isAdmin,
        password: ['', []],
        confirmPassword: ['', [expect.any(Function)]],
      });

      component.user = mockUserNew;
      component.ngOnChanges(mockUserChangeNew);

      expect(formBuilder.group).toHaveBeenLastCalledWith({
        username: [
          mockUserNew.username,
          [expect.any(Function), expect.any(Function)],
        ],
        isAdmin: mockUserNew.isAdmin,
        password: ['', [expect.any(Function), expect.any(Function)]],
        confirmPassword: [
          '',
          [expect.any(Function), expect.any(Function), expect.any(Function)],
        ],
      });
    });
  });

  describe('toggleCreateUserPwdInputsHide', () => {
    it('should toggle password inputs visibility', () => {
      fixture.detectChanges();
      expect(component.createUserPwdInputsHide).toEqual(true);
      component.toggleCreateUserPwdInputsHide();
      expect(component.createUserPwdInputsHide).toEqual(false);
      component.toggleCreateUserPwdInputsHide();
      expect(component.createUserPwdInputsHide).toEqual(true);
    });
  });

  describe('onCreateUserSubmit', () => {
    it('should prevent default on passed event and return early if user can not be submitted', () => {
      (userFormService.updateUserHandler as jest.Mock).mockClear();
      (userFormService.createUserHandler as jest.Mock).mockClear();
      component.createUserProcessing = true;
      fixture.detectChanges();

      const mockEvent: any = { preventDefault: jest.fn() };

      component.onCreateUserSubmit(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();

      component.createUserProcessing = false;
      fixture.detectChanges();

      component.onCreateUserSubmit(mockEvent);

      component.user = mockUserNew;
      component.ngOnChanges(mockUserChangeNew);

      component.onCreateUserSubmit(mockEvent);

      expect(userFormService.updateUserHandler).not.toHaveBeenCalled();
      expect(userFormService.createUserHandler).not.toHaveBeenCalled();
    });

    it('should prevent default on passed event and call save action if user can be submitted', () => {
      (userFormService.updateUserHandler as jest.Mock).mockClear();
      (userFormService.createUserHandler as jest.Mock).mockClear();
      component.createUserProcessing = false;
      fixture.detectChanges();

      component.user = mockUserEdit;
      component.ngOnChanges(mockUserChangeEdit);

      const mockEvent: any = { preventDefault: jest.fn() };

      component.onCreateUserSubmit(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();

      expect(userFormService.updateUserHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('saveAction', () => {
    it('should call createUserHandler when isEdit flag is false', () => {
      (userFormService.updateUserHandler as jest.Mock).mockClear();
      (userFormService.createUserHandler as jest.Mock).mockClear();
      fixture.detectChanges();
      component.user = mockUserNew;
      component.ngOnChanges(mockUserChangeNew);

      buttonsAction$.next(PageContentEntityToolbarButtons.Save);

      expect(userFormService.updateUserHandler).not.toHaveBeenCalled();
      expect(userFormService.createUserHandler).toHaveBeenLastCalledWith(
        component.createUserForm.value,
      );
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from entity button actions', () => {
      (userFormService.updateUserHandler as jest.Mock).mockClear();
      fixture.detectChanges();
      component.user = mockUserEdit;
      component.ngOnChanges(mockUserChangeEdit);
      const spyOnCreateUserForm = jest.spyOn(component.createUserForm, 'reset');

      buttonsAction$.next(PageContentEntityToolbarButtons.Reset);
      expect(spyOnCreateUserForm).toHaveBeenCalledTimes(1);

      buttonsAction$.next(PageContentEntityToolbarButtons.Save);
      expect(userFormService.updateUserHandler).toHaveBeenCalledTimes(1);

      spyOnCreateUserForm.mockClear();
      (userFormService.updateUserHandler as jest.Mock).mockClear();

      component.ngOnDestroy();
      buttonsAction$.next(PageContentEntityToolbarButtons.Reset);
      buttonsAction$.next(PageContentEntityToolbarButtons.Save);
      expect(spyOnCreateUserForm).not.toHaveBeenCalled();
      expect(userFormService.updateUserHandler).not.toHaveBeenCalled();
    });
  });
});
