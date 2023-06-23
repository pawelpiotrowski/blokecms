import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { PageContentEntityToolbarButtonAction } from '../../../layout/page-content-entity-layout/page-content-entity-layout.interface';
import { PageEntityContentRepository } from '../../../layout/page-content-entity-layout/page-entity-content.repository';
import { CodeEditComponent, GetScriptResponse } from 'shared-lib';
import { ScriptFormService } from './script-form.service';
import { ScriptFormComponent } from './script-form.component';
import { mockPageContentEntityFormService } from '../../../../../test/page-content-entity-form-service.mock';

describe('ScriptFormComponent', () => {
  let component: ScriptFormComponent;
  let fixture: ComponentFixture<ScriptFormComponent>;
  let scriptFormService: ScriptFormService;

  const mockScriptFormService = mockPageContentEntityFormService;

  const buttonsAction$ =
    new BehaviorSubject<PageContentEntityToolbarButtonAction>(null);
  const mockEntityRepository = {
    buttonsAction$,
  };
  const mockScriptNew = {
    _id: '',
    name: '',
    formatted: '',
  };
  const mockScriptEdit = {
    _id: '123456',
    name: 'foo',
    formatted: 'html { padding: 0; }',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([])],
      declarations: [ScriptFormComponent, CodeEditComponent],
      providers: [
        { provide: ScriptFormService, useValue: mockScriptFormService },
        {
          provide: PageEntityContentRepository,
          useValue: mockEntityRepository,
        },
      ],
    })
      .overrideComponent(ScriptFormComponent, {
        set: {
          providers: [
            {
              provide: ScriptFormService,
              useValue: mockScriptFormService,
            },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ScriptFormComponent);
    scriptFormService = TestBed.inject(ScriptFormService);
    component = fixture.componentInstance;
  });

  describe('codeUpdateHandler', () => {
    it('should save formatted code', () => {
      const mockFormatted = 'body { display: none; }';
      component.entity = mockScriptNew;
      fixture.detectChanges();
      component.codeUpdateHandler(mockFormatted);
      expect(component.formatted).toEqual(mockFormatted);
    });

    it('should enable save and reset buttons when in edit mode', () => {
      const mockFormatted = 'body { display: none; }';
      component.entity = mockScriptEdit;
      fixture.detectChanges();
      component.codeUpdateHandler(mockFormatted);
      expect(component.formatted).toEqual(mockFormatted);
      expect(scriptFormService.toggleResetButton).toHaveBeenCalledWith(true);
      expect(scriptFormService.toggleSaveButton).toHaveBeenCalledWith(true);
    });
  });

  it.todo('Refactor tests to call public methods instead of private');

  describe('resetScript', () => {
    it('should set script to query response and reset entity form', () => {
      component.entity = mockScriptEdit;
      fixture.detectChanges();
      jest.spyOn(component.entityForm, 'setValue');
      jest.spyOn(component.codeEditor as CodeEditComponent, 'resetCodeEditor');

      const mockQueryRespData: GetScriptResponse = {
        script: {
          _id: '313',
          name: 'FooBar',
          formatted: 'body { margin: 0; }',
        },
      };
      (component as any).resetScript(mockQueryRespData);

      expect(component.entity).toEqual(mockQueryRespData.script);
      expect(component.entityForm.setValue).toHaveBeenLastCalledWith({
        name: component.entity.name,
      });
      expect(component.codeEditor?.resetCodeEditor).toHaveBeenLastCalledWith(
        component.formatted,
      );
    });
  });

  describe('create', () => {
    it('should call script form service create method passing form name', () => {
      component.entity = mockScriptNew;
      fixture.detectChanges();

      component.entityForm.setValue({
        name: 'Test',
      });
      (component as any).create();

      expect(scriptFormService.createHandler).toHaveBeenLastCalledWith({
        name: component.entityForm.value.name,
        formatted: component.formatted,
      });
    });
  });

  describe('update', () => {
    it('should call script form service update method passing form name and entity id', () => {
      component.entity = mockScriptEdit;
      fixture.detectChanges();

      component.entityForm.setValue({
        name: 'Test',
      });
      (component as any).update();

      expect(scriptFormService.updateHandler).toHaveBeenLastCalledWith({
        name: component.entityForm.value.name,
        _id: component.entity._id,
        formatted: component.formatted,
      });
    });
  });
});
