import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { Editor } from 'ngx-editor';
import { BehaviorSubject } from 'rxjs';
import {
  PageContentEntityToolbarButtonAction,
  PageContentEntityToolbarButtons,
} from '../../../layout/page-content-entity-layout/page-content-entity-layout.interface';
import { PageEntityContentRepository } from '../../../layout/page-content-entity-layout/page-entity-content.repository';

import { BlockFormComponent } from './block-form.component';
import { BlockFormService } from './block-form.service';

describe('BlockFormComponent', () => {
  let component: BlockFormComponent;
  let fixture: ComponentFixture<BlockFormComponent>;
  let blockFormService: BlockFormService;
  let entityRepo: PageEntityContentRepository;

  const mockBlockFormService = {
    toggleSaveButton: jest.fn(),
    toggleResetButton: jest.fn(),
    createHandler: jest.fn(),
    updateHandler: jest.fn(),
  };

  const buttonsAction$ =
    new BehaviorSubject<PageContentEntityToolbarButtonAction>(null);
  const mockEntityRepository = {
    buttonsAction$,
  };

  const mockJsonDocObject = {
    type: 'doc',
    content: [
      {
        attrs: { align: null },
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'test',
          },
        ],
      },
    ],
  };
  const mockBlockTextEdit = {
    _id: '1',
    name: 'foo',
    text: 'text',
    jsonDoc: JSON.stringify(mockJsonDocObject),
    html: '<p>test</p>',
  };
  const mockBlockTextNew = {
    _id: '',
    name: '',
    text: '',
    jsonDoc: '',
    html: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlockFormComponent],
      providers: [
        { provide: BlockFormService, useValue: mockBlockFormService },
        {
          provide: PageEntityContentRepository,
          useValue: mockEntityRepository,
        },
      ],
    })
      .overrideComponent(BlockFormComponent, {
        set: {
          providers: [
            { provide: BlockFormService, useValue: mockBlockFormService },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(BlockFormComponent);
    blockFormService = TestBed.inject(BlockFormService);
    entityRepo = TestBed.inject(PageEntityContentRepository);
    component = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should disable save and reset buttons', () => {
      component.blockText = mockBlockTextNew;
      fixture.detectChanges();
      expect(blockFormService.toggleSaveButton).toHaveBeenLastCalledWith(false);
      expect(blockFormService.toggleResetButton).toHaveBeenLastCalledWith(
        false,
      );
    });

    it('should set isEdit to true if blockText has _id', () => {
      component.blockText = mockBlockTextEdit;
      fixture.detectChanges();

      expect(component.isEdit).toEqual(true);
    });

    it('should set isEdit to false if blockText has NO _id', () => {
      component.blockText = mockBlockTextNew;
      fixture.detectChanges();

      expect(component.isEdit).toEqual(false);
    });

    it('should subscribe to entity button actions', () => {
      jest.spyOn(entityRepo.buttonsAction$, 'subscribe');
      component.blockText = mockBlockTextEdit;
      fixture.detectChanges();
      expect(entityRepo.buttonsAction$.subscribe).toHaveBeenCalledTimes(1);
    });

    it('should set editor form', () => {
      component.blockText = mockBlockTextNew;
      fixture.detectChanges();
      expect(component.editorForm).toBeInstanceOf(FormGroup);
    });

    it('should set editor', () => {
      component.blockText = mockBlockTextEdit;
      fixture.detectChanges();
      expect(component.editor).toBeInstanceOf(Editor);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from all subscriptions and destroy editor', () => {
      component.blockText = mockBlockTextNew;
      fixture.detectChanges();
      // when subscribed currently both actions are resulting with buttons being disabled
      buttonsAction$.next(PageContentEntityToolbarButtons.Save);
      expect(blockFormService.toggleSaveButton).toHaveBeenLastCalledWith(false);
      (blockFormService.toggleSaveButton as jest.Mock).mockClear();
      jest.spyOn(component.editor, 'destroy');

      component.ngOnDestroy();

      buttonsAction$.next(PageContentEntityToolbarButtons.Save);
      expect(blockFormService.toggleSaveButton).not.toHaveBeenCalled();
      expect(component.editor.destroy).toHaveBeenCalled();
    });
  });

  describe('editorForm', () => {
    beforeEach(() => {
      component.blockText = mockBlockTextNew;
      fixture.detectChanges();
    });

    it('should toggle save button with flag based on form status changes', () => {
      (blockFormService.toggleSaveButton as jest.Mock).mockClear();
      component.editorForm.setValue({ editorContent: '', name: '' });
      expect(blockFormService.toggleSaveButton).toHaveBeenLastCalledWith(false);
      component.editorForm.setValue({
        editorContent: 'hello there',
        name: 'hello',
      });
      expect(blockFormService.toggleSaveButton).toHaveBeenLastCalledWith(true);
    });
  });

  describe('resetAction', () => {
    it('should disable save and reset buttons and set editor content to initial state', () => {
      component.blockText = mockBlockTextEdit;
      fixture.detectChanges();

      (blockFormService.toggleSaveButton as jest.Mock).mockClear();
      (blockFormService.toggleResetButton as jest.Mock).mockClear();

      buttonsAction$.next(PageContentEntityToolbarButtons.Reset);

      expect(blockFormService.toggleResetButton).toHaveBeenCalledTimes(1);
      expect(blockFormService.toggleResetButton).toHaveBeenCalledWith(false);
      expect(blockFormService.toggleSaveButton).toHaveBeenCalledTimes(1);
      expect(blockFormService.toggleSaveButton).toHaveBeenCalledWith(false);
    });
  });

  describe('saveAction', () => {
    it('should call create handler when NOT in edit mode', () => {
      component.blockText = mockBlockTextNew;
      (blockFormService.createHandler as jest.Mock).mockClear();
      fixture.detectChanges();

      const mockNewContent = '<p>Hello</p>';
      component.editor.setContent(mockNewContent);
      component.editorForm.setValue({
        editorContent: mockNewContent,
        name: 'Foo',
      });

      buttonsAction$.next(PageContentEntityToolbarButtons.Save);

      expect(blockFormService.createHandler).toHaveBeenLastCalledWith({
        html: mockNewContent,
        jsonDoc: expect.stringContaining('Hello'),
        name: expect.any(String),
        text: 'Hello',
      });
    });

    it('should call create handler when in edit mode', () => {
      component.blockText = mockBlockTextEdit;
      (blockFormService.updateHandler as jest.Mock).mockClear();
      fixture.detectChanges();

      buttonsAction$.next(PageContentEntityToolbarButtons.Save);

      expect(blockFormService.updateHandler).toHaveBeenLastCalledWith(
        expect.objectContaining({ _id: mockBlockTextEdit._id }),
      );
    });
  });
});
