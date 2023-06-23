import { Component, Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import {
  PageContentEntityToolbarButtonAction,
  PageContentEntityToolbarButtons,
} from '../page-content-entity-layout/page-content-entity-layout.interface';
import { PageEntityContentRepository } from '../page-content-entity-layout/page-entity-content.repository';
import { PageContentEntityFormComponent } from './page-content-entity-form.component';

@Injectable()
export class MockPageContentEntityFormService {
  toggleSaveButton = jest.fn();
  toggleResetButton = jest.fn();
  createHandler = jest.fn();
  updateHandler = jest.fn();
  getUpdateHandler = jest.fn();
  getLastSave = jest.fn().mockReturnValue(of(null));
  cleanQueryParams = jest.fn();
}

const buttonsAction$ =
  new BehaviorSubject<PageContentEntityToolbarButtonAction>(null);
const mockEntityRepository = {
  buttonsAction$,
};

@Component({
  selector: 'admin-test-page-content-entity-form',
  template: '<div></div>',
})
export class TestPageContentEntityFormComponent extends PageContentEntityFormComponent<
  any,
  any,
  any,
  any
> {
  constructor(
    entityRepo: PageEntityContentRepository,
    private formBuilder: FormBuilder,
    private entityFormService: MockPageContentEntityFormService,
  ) {
    super(entityRepo);
    this.formService = this.entityFormService as any;
    this.setFormFunction = this.setEntityForm;
    this.createFunction = this.create;
    this.updateFunction = this.update;
    this.resetEntityEditFunction = this.resetEntity.bind(this);
    this.postOnInitFunction = this.postInit;
  }

  setEntityForm() {
    this.entityForm = this.formBuilder.group({
      name: [this.entity.name, [Validators.required, Validators.minLength(1)]],
    });
  }
  postInit = jest.fn();
  resetEntity = jest.fn();
  create = jest.fn();
  update = jest.fn();
}

describe('PageContentEntityFormComponent', () => {
  let component: TestPageContentEntityFormComponent;
  let fixture: ComponentFixture<TestPageContentEntityFormComponent>;
  let formService: MockPageContentEntityFormService;
  let entityRepo: PageEntityContentRepository;

  const mockEntityNew = { name: '', _id: '' };
  const mockEntityEdit = { name: 'FooEntity', _id: '321123' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestPageContentEntityFormComponent],
      providers: [
        MockPageContentEntityFormService,
        {
          provide: PageEntityContentRepository,
          useValue: mockEntityRepository,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestPageContentEntityFormComponent);
    component = fixture.componentInstance;
    formService = TestBed.inject(MockPageContentEntityFormService);
    entityRepo = TestBed.inject(PageEntityContentRepository);
  });

  describe('ngOnInit', () => {
    it('should disable save and reset buttons', () => {
      component.entity = mockEntityNew;
      fixture.detectChanges();
      expect(formService.toggleSaveButton).toHaveBeenLastCalledWith(false);
      expect(formService.toggleResetButton).toHaveBeenLastCalledWith(false);
    });

    it('should set isEdit to true if entity has _id', () => {
      component.entity = mockEntityEdit;
      fixture.detectChanges();

      expect(component.isEdit).toEqual(true);
    });

    it('should set isEdit to false if entity has NO _id', () => {
      component.entity = mockEntityNew;
      fixture.detectChanges();

      expect(component.isEdit).toEqual(false);
    });

    it('should subscribe to entity button actions', () => {
      jest.spyOn(entityRepo.buttonsAction$, 'subscribe');
      component.entity = mockEntityEdit;
      fixture.detectChanges();
      expect(entityRepo.buttonsAction$.subscribe).toHaveBeenCalledTimes(1);
    });

    it('should set entity form', () => {
      component.entity = mockEntityNew;
      fixture.detectChanges();
      expect(component.entityForm).toBeInstanceOf(FormGroup);
    });

    it('should call post init callback if defined', () => {
      component.entity = mockEntityNew;
      (component.postInit as jest.Mock).mockClear();
      fixture.detectChanges();

      expect(component.postInit).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from all subscriptions', () => {
      component.entity = mockEntityNew;
      fixture.detectChanges();
      // when subscribed currently both actions are resulting with buttons being disabled
      buttonsAction$.next(PageContentEntityToolbarButtons.Save);
      expect(formService.toggleSaveButton).toHaveBeenLastCalledWith(false);
      (formService.toggleSaveButton as jest.Mock).mockClear();

      component.ngOnDestroy();

      buttonsAction$.next(PageContentEntityToolbarButtons.Save);
      expect(formService.toggleSaveButton).not.toHaveBeenCalled();
    });
  });

  describe('entityFormSubmit', () => {
    it('should prevent default on passed event and return early if entity can not be submitted', () => {
      component.entity = mockEntityNew;
      fixture.detectChanges();

      const mockEvent: any = { preventDefault: jest.fn() };

      (component.create as jest.Mock).mockClear();
      (component.update as jest.Mock).mockClear();

      component.entityFormSubmit(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();

      expect(component.update).not.toHaveBeenCalled();
      expect(component.create).not.toHaveBeenCalled();
    });

    it('should prevent default on passed event and call save action if entity can be submitted', () => {
      component.entity = mockEntityEdit;
      fixture.detectChanges();

      const mockEvent: any = { preventDefault: jest.fn() };

      (component.create as jest.Mock).mockClear();
      (component.update as jest.Mock).mockClear();

      component.entityFormSubmit(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();

      expect(component.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('entityFormValueChangeHandler', () => {
    it('should enable reset and save buttons on change', () => {
      component.entity = mockEntityEdit;
      fixture.detectChanges();

      component.entityForm.markAsDirty();
      component.entityForm.setValue({
        name: 'Hello',
      });

      expect(formService.toggleResetButton).toHaveBeenLastCalledWith(true);
      expect(formService.toggleSaveButton).toHaveBeenLastCalledWith(true);
    });
  });

  describe('resetAction', () => {
    it('should get last saved version of entity and disable save and reset buttons', () => {
      component.entity = { ...mockEntityEdit };
      component.entity.name = 'Test ' + component.entity.name;
      (formService.getLastSave as jest.Mock).mockReturnValueOnce(
        of({
          data: { foo: 'bar' },
        }),
      );
      fixture.detectChanges();
      (component.resetEntity as jest.Mock).mockClear();
      jest.spyOn(component.entityForm, 'reset');

      expect(component.entity.name).toEqual('Test FooEntity');

      buttonsAction$.next(PageContentEntityToolbarButtons.Reset);

      expect(component.resetEntity).toHaveBeenCalledWith({ foo: 'bar' });
      expect(formService.toggleResetButton).toHaveBeenLastCalledWith(false);
      expect(formService.toggleSaveButton).toHaveBeenLastCalledWith(false);
      expect(component.entityForm.reset).not.toHaveBeenCalled();
    });

    it('should reset form and return early if entity is new', () => {
      component.entity = { ...mockEntityNew };
      component.entity.name = 'New ' + component.entity.name;
      fixture.detectChanges();
      (component.resetEntity as jest.Mock).mockClear();
      jest.spyOn(component.entityForm, 'reset');

      expect(component.entity.name).toEqual('New ');

      buttonsAction$.next(PageContentEntityToolbarButtons.Reset);

      expect(component.entityForm.reset).toHaveBeenCalled();
    });
  });
});
