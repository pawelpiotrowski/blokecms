import { of } from 'rxjs';

export const mockPageContentEntityFormService = {
  toggleSaveButton: jest.fn(),
  toggleResetButton: jest.fn(),
  createHandler: jest.fn(),
  updateHandler: jest.fn(),
  getUpdateHandler: jest.fn(),
  getLastSave: jest.fn().mockReturnValue(of(null)),
  cleanQueryParams: jest.fn(),
};
