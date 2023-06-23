import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { CodeEditComponent, GetBlockCodeResponse } from 'shared-lib';
import { PageContentEntityToolbarButtonAction } from '../../../layout/page-content-entity-layout/page-content-entity-layout.interface';
import { PageEntityContentRepository } from '../../../layout/page-content-entity-layout/page-entity-content.repository';
import { CodeFormComponent } from './code-form.component';
import { CodeFormService } from './code-form.service';

describe('CodeFormComponent', () => {
  let component: CodeFormComponent;
  let fixture: ComponentFixture<CodeFormComponent>;
  let codeFormService: CodeFormService;

  const mockCodeFormService = {
    toggleSaveButton: jest.fn(),
    toggleResetButton: jest.fn(),
    createHandler: jest.fn(),
    updateHandler: jest.fn(),
    getUpdateHandler: jest.fn(),
    getLastSave: jest.fn().mockReturnValue(of(null)),
  };

  const buttonsAction$ =
    new BehaviorSubject<PageContentEntityToolbarButtonAction>(null);
  const mockEntityRepository = {
    buttonsAction$,
  };
  const mockCodeNew = {
    _id: '',
    name: '',
    code: '',
    lang: 'css',
    showLineNumbers: false,
  };
  const mockCodeEdit = {
    _id: '123456',
    name: 'foo',
    code: 'html { padding: 0; }',
    lang: 'css',
    showLineNumbers: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        MatInputModule,
        MatCheckboxModule,
        MatSelectModule,
        MatFormFieldModule,
        NoopAnimationsModule,
      ],
      declarations: [CodeFormComponent, CodeEditComponent],
      providers: [
        { provide: CodeFormService, useValue: mockCodeFormService },
        {
          provide: PageEntityContentRepository,
          useValue: mockEntityRepository,
        },
      ],
    })
      .overrideComponent(CodeFormComponent, {
        set: {
          providers: [
            {
              provide: CodeFormService,
              useValue: mockCodeFormService,
            },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CodeFormComponent);
    codeFormService = TestBed.inject(CodeFormService);
    component = fixture.componentInstance;
  });

  describe('codeUpdateHandler', () => {
    it('should save code', () => {
      const mockCode = 'body { display: none; }';
      component.entity = mockCodeNew;
      fixture.detectChanges();
      component.codeUpdateHandler(mockCode);
      expect(component.code).toEqual(mockCode);
    });

    it('should enable save and reset buttons when in edit mode', () => {
      const mockCode = 'body { display: none; }';
      component.entity = mockCodeEdit;
      fixture.detectChanges();
      component.codeUpdateHandler(mockCode);
      expect(component.code).toEqual(mockCode);
      expect(codeFormService.toggleResetButton).toHaveBeenCalledWith(true);
      expect(codeFormService.toggleSaveButton).toHaveBeenCalledWith(true);
    });
  });

  it.todo('Refactor tests to call public methods instead of private');

  describe('resetCode', () => {
    it('should set code to query response and reset entity form', () => {
      component.entity = mockCodeEdit;
      fixture.detectChanges();
      jest.spyOn(component.entityForm, 'setValue');
      jest.spyOn(component.codeEditor as CodeEditComponent, 'resetCodeEditor');

      const mockQueryRespData: GetBlockCodeResponse = {
        blockCode: {
          _id: '313',
          name: 'FooBar',
          code: 'body { margin: 0; }',
          showLineNumbers: true,
          lang: 'css',
        },
      };
      (component as any).resetCode(mockQueryRespData);

      expect(component.entity).toEqual(mockQueryRespData.blockCode);
      expect(component.entityForm.setValue).toHaveBeenLastCalledWith({
        name: component.entity.name,
        showLineNumbers: component.entity.showLineNumbers,
        lang: component.entity.lang,
      });
      expect(component.codeEditor?.resetCodeEditor).toHaveBeenLastCalledWith(
        component.code,
      );
    });
  });

  describe('create', () => {
    it('should call code form service create method passing form name', () => {
      component.entity = mockCodeNew;
      fixture.detectChanges();

      component.entityForm.setValue({
        name: 'Test',
        lang: 'typescript',
        showLineNumbers: true,
      });
      (component as any).create();

      expect(codeFormService.createHandler).toHaveBeenLastCalledWith({
        name: component.entityForm.value.name,
        code: component.code,
        lang: component.entityForm.value.lang,
        showLineNumbers: component.entityForm.value.showLineNumbers,
      });
    });
  });

  describe('update', () => {
    it('should call code form service update method passing form name and entity id', () => {
      component.entity = mockCodeEdit;
      fixture.detectChanges();

      component.entityForm.setValue({
        name: 'Test',
        lang: 'javascript',
        showLineNumbers: false,
      });
      (component as any).update();

      expect(codeFormService.updateHandler).toHaveBeenLastCalledWith({
        name: component.entityForm.value.name,
        _id: component.entity._id,
        code: component.code,
        lang: component.entityForm.value.lang,
        showLineNumbers: component.entityForm.value.showLineNumbers,
      });
    });
  });
});
