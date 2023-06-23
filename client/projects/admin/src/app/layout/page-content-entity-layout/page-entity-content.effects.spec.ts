import { TestBed } from '@angular/core/testing';
import {
  Actions,
  provideEffects,
  provideEffectsManager,
} from '@ngneat/effects-ng';
import {
  pageContentEntityDisableBackButton,
  pageContentEntityDisableCreateButton,
  pageContentEntityDisableDeleteButton,
  pageContentEntityDisableEditButton,
  pageContentEntityDisableResetButton,
  pageContentEntityDisableSaveButton,
  pageContentEntityEnableBackButton,
  pageContentEntityEnableCreateButton,
  pageContentEntityEnableDeleteButton,
  pageContentEntityEnableEditButton,
  pageContentEntityEnableResetButton,
  pageContentEntityEnableSaveButton,
} from './page-entity-content.actions';
import { PageEntityContentEffects } from './page-entity-content.effects';
import { PageEntityContentRepository } from './page-entity-content.repository';

describe('PageEntityContentEffects', () => {
  let repo: PageEntityContentRepository;
  const mockPageEntityContentRepository = {
    updateButtonsAvailability: jest.fn(),
  };
  // use a custom action stream to replace the stream before each test
  // It's recommended to only use this feature for testing purposes.
  let testActionsStream = new Actions();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: PageEntityContentRepository,
          useValue: mockPageEntityContentRepository,
        },
        provideEffectsManager({
          customActionsStream: testActionsStream,
          dispatchByDefault: true,
        }),
        provideEffects(PageEntityContentEffects),
      ],
    });
    repo = TestBed.inject(PageEntityContentRepository);
  });

  describe('disableBackButton$', () => {
    it('should set repo back button availability to false', () => {
      testActionsStream.dispatch(pageContentEntityDisableBackButton());
      expect(repo.updateButtonsAvailability).toHaveBeenLastCalledWith({
        Back: false,
      });
    });
  });

  describe('enableBackButton$', () => {
    it('should set repo back button availability to true', () => {
      testActionsStream.dispatch(pageContentEntityEnableBackButton());
      expect(repo.updateButtonsAvailability).toHaveBeenLastCalledWith({
        Back: true,
      });
    });
  });

  describe('disableCreateButton$', () => {
    it('should set repo create button availability to false', () => {
      testActionsStream.dispatch(pageContentEntityDisableCreateButton());
      expect(repo.updateButtonsAvailability).toHaveBeenLastCalledWith({
        Create: false,
      });
    });
  });

  describe('enableCreateButton$', () => {
    it('should set repo create button availability to true', () => {
      testActionsStream.dispatch(pageContentEntityEnableCreateButton());
      expect(repo.updateButtonsAvailability).toHaveBeenLastCalledWith({
        Create: true,
      });
    });
  });

  describe('disableEditButton$', () => {
    it('should set repo edit button availability to false', () => {
      testActionsStream.dispatch(pageContentEntityDisableEditButton());
      expect(repo.updateButtonsAvailability).toHaveBeenLastCalledWith({
        Edit: false,
      });
    });
  });

  describe('enableEditButton$', () => {
    it('should set repo edit button availability to true', () => {
      testActionsStream.dispatch(pageContentEntityEnableEditButton());
      expect(repo.updateButtonsAvailability).toHaveBeenLastCalledWith({
        Edit: true,
      });
    });
  });

  describe('disableDeleteButton$', () => {
    it('should set repo delete button availability to false', () => {
      testActionsStream.dispatch(pageContentEntityDisableDeleteButton());
      expect(repo.updateButtonsAvailability).toHaveBeenLastCalledWith({
        Delete: false,
      });
    });
  });

  describe('enableDeleteButton$', () => {
    it('should set repo delete button availability to true', () => {
      testActionsStream.dispatch(pageContentEntityEnableDeleteButton());
      expect(repo.updateButtonsAvailability).toHaveBeenLastCalledWith({
        Delete: true,
      });
    });
  });

  describe('disableSaveButton$', () => {
    it('should set repo save button availability to false', () => {
      testActionsStream.dispatch(pageContentEntityDisableSaveButton());
      expect(repo.updateButtonsAvailability).toHaveBeenLastCalledWith({
        Save: false,
      });
    });
  });

  describe('enableSaveButton$', () => {
    it('should set repo save button availability to true', () => {
      testActionsStream.dispatch(pageContentEntityEnableSaveButton());
      expect(repo.updateButtonsAvailability).toHaveBeenLastCalledWith({
        Save: true,
      });
    });
  });

  describe('disableResetButton$', () => {
    it('should set repo reset button availability to false', () => {
      testActionsStream.dispatch(pageContentEntityDisableResetButton());
      expect(repo.updateButtonsAvailability).toHaveBeenLastCalledWith({
        Reset: false,
      });
    });
  });

  describe('enableResetButton$', () => {
    it('should set repo reset button availability to true', () => {
      testActionsStream.dispatch(pageContentEntityEnableResetButton());
      expect(repo.updateButtonsAvailability).toHaveBeenLastCalledWith({
        Reset: true,
      });
    });
  });
});
