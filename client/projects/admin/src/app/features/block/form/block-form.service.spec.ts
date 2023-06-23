import { fakeAsync, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Actions } from '@ngneat/effects-ng';
import { Subject } from 'rxjs';
import {
  LoggerService,
  CreateBlockTextGQL,
  GetBlocksTextGQL,
  UpdateBlockTextGQL,
  GetBlockTextGQL,
} from 'shared-lib';
import { BlockFormService } from './block-form.service';

describe('BlockFormService', () => {
  let service: BlockFormService;
  let router: Router;
  let updateText: UpdateBlockTextGQL;

  const mockActions = {
    dispatch: jest.fn(),
  };
  const mockLoggerService = {
    error: jest.fn(),
  };
  const createTextSource$ = new Subject();
  const mockCreateTextSource = {
    mutate: jest.fn().mockReturnValue(createTextSource$.asObservable()),
  };
  const updateTextSource$ = new Subject();
  const mockUpdateTextSource = {
    mutate: jest.fn().mockReturnValue(updateTextSource$.asObservable()),
  };
  const mockGetTexts = { document: {} };
  const getTextSource$ = new Subject();
  const mockGetTextSource = {
    fetch: jest.fn().mockReturnValue(getTextSource$.asObservable()),
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: Actions, useValue: mockActions },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: CreateBlockTextGQL, useValue: mockCreateTextSource },
        { provide: UpdateBlockTextGQL, useValue: mockUpdateTextSource },
        { provide: GetBlocksTextGQL, useValue: mockGetTexts },
        { provide: GetBlockTextGQL, useValue: mockGetTextSource },
        BlockFormService,
      ],
    });
    service = TestBed.inject(BlockFormService);
    router = TestBed.inject(Router);
    updateText = TestBed.inject(UpdateBlockTextGQL);
  });

  describe('createHandler', () => {
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
    const mockBlockCreateInput = {
      name: 'name',
      text: 'Test',
      jsonDoc: JSON.stringify(mockJsonDocObject),
      html: '<p>Test</p>',
    };
    const mockCreatedBlockText = {
      createBlockText: {
        _id: '1',
        name: 'name',
      },
    };

    it('should call create block text mutation', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      const createSpy = jest.spyOn(service, 'create');

      service.createHandler(mockBlockCreateInput);

      const dataMap: any = createSpy.mock.calls[0][1];

      expect(createSpy).toHaveBeenLastCalledWith(
        mockBlockCreateInput,
        expect.any(Function),
      );
      expect(dataMap({ data: mockCreatedBlockText })).toEqual(
        mockCreatedBlockText.createBlockText,
      );
      expect(dataMap({ data: null })).toEqual(undefined);
    }));
  });

  describe('updateHandler', () => {
    const mockBlockUpdateInput = {
      _id: '2',
      text: 'Hello',
      jsonDoc: JSON.stringify({}),
      html: '<p>Hello</p>',
    };
    const mockUpdatedBlockText = {
      updateBlockText: {
        _id: '2',
        name: 'name',
      },
    };

    it('should call update block text mutation', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      const updateSpy = jest.spyOn(service, 'update');

      service.updateHandler(mockBlockUpdateInput);

      const dataMap: any = updateSpy.mock.calls[0][1];

      expect(updateSpy).toHaveBeenLastCalledWith(
        mockBlockUpdateInput,
        expect.any(Function),
      );
      expect(dataMap({ data: mockUpdatedBlockText })).toEqual(
        mockUpdatedBlockText.updateBlockText,
      );
      expect(dataMap({ data: null })).toEqual(undefined);
    }));
  });
});
