import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { PageContentEntityToolbarButtonAction } from '../../../layout/page-content-entity-layout/page-content-entity-layout.interface';
import { PageEntityContentRepository } from '../../../layout/page-content-entity-layout/page-entity-content.repository';
import { CodeEditComponent, GetStyleResponse } from 'shared-lib';
import { StyleFormService } from './style-form.service';
import { StyleFormComponent } from './style-form.component';
import { mockPageContentEntityFormService } from '../../../../../test/page-content-entity-form-service.mock';

describe('StyleFormComponent', () => {
  let component: StyleFormComponent;
  let fixture: ComponentFixture<StyleFormComponent>;
  let styleFormService: StyleFormService;

  const mockStyleFormService = mockPageContentEntityFormService;

  const buttonsAction$ =
    new BehaviorSubject<PageContentEntityToolbarButtonAction>(null);
  const mockEntityRepository = {
    buttonsAction$,
  };
  const mockStyleNew = {
    _id: '',
    name: '',
    formatted: '',
  };
  const mockStyleEdit = {
    _id: '123456',
    name: 'foo',
    formatted: 'html { padding: 0; }',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([])],
      declarations: [StyleFormComponent, CodeEditComponent],
      providers: [
        { provide: StyleFormService, useValue: mockStyleFormService },
        {
          provide: PageEntityContentRepository,
          useValue: mockEntityRepository,
        },
      ],
    })
      .overrideComponent(StyleFormComponent, {
        set: {
          providers: [
            {
              provide: StyleFormService,
              useValue: mockStyleFormService,
            },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(StyleFormComponent);
    styleFormService = TestBed.inject(StyleFormService);
    component = fixture.componentInstance;
  });

  describe('codeUpdateHandler', () => {
    it('should save formatted code', () => {
      const mockFormatted = 'body { display: none; }';
      component.entity = mockStyleNew;
      fixture.detectChanges();
      component.codeUpdateHandler(mockFormatted);
      expect(component.formatted).toEqual(mockFormatted);
    });

    it('should enable save and reset buttons when in edit mode', () => {
      const mockFormatted = 'body { display: none; }';
      component.entity = mockStyleEdit;
      fixture.detectChanges();
      component.codeUpdateHandler(mockFormatted);
      expect(component.formatted).toEqual(mockFormatted);
      expect(styleFormService.toggleResetButton).toHaveBeenCalledWith(true);
      expect(styleFormService.toggleSaveButton).toHaveBeenCalledWith(true);
    });
  });

  it.todo('Refactor tests to call public methods instead of private');

  describe('resetStyle', () => {
    it('should set style to query response and reset entity form', () => {
      component.entity = mockStyleEdit;
      fixture.detectChanges();
      jest.spyOn(component.entityForm, 'setValue');
      jest.spyOn(component.codeEditor as CodeEditComponent, 'resetCodeEditor');

      const mockQueryRespData: GetStyleResponse = {
        style: {
          _id: '313',
          name: 'FooBar',
          formatted: 'body { margin: 0; }',
        },
      };
      (component as any).resetStyle(mockQueryRespData);

      expect(component.entity).toEqual(mockQueryRespData.style);
      expect(component.entityForm.setValue).toHaveBeenLastCalledWith({
        name: component.entity.name,
      });
      expect(component.codeEditor?.resetCodeEditor).toHaveBeenLastCalledWith(
        component.formatted,
      );
    });
  });

  describe('create', () => {
    it('should call style form service create method passing form name', () => {
      component.entity = mockStyleNew;
      fixture.detectChanges();

      component.entityForm.setValue({
        name: 'Test',
      });
      (component as any).create();

      expect(styleFormService.createHandler).toHaveBeenLastCalledWith({
        name: component.entityForm.value.name,
        formatted: component.formatted,
      });
    });
  });

  describe('update', () => {
    it('should call style form service update method passing form name and entity id', () => {
      component.entity = mockStyleEdit;
      fixture.detectChanges();

      component.entityForm.setValue({
        name: 'Test',
      });
      (component as any).update();

      expect(styleFormService.updateHandler).toHaveBeenLastCalledWith({
        name: component.entityForm.value.name,
        _id: component.entity._id,
        formatted: component.formatted,
      });
    });
  });
});
