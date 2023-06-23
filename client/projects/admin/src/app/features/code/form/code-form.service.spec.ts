import { fakeAsync, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Actions } from '@ngneat/effects-ng';
import { Subject } from 'rxjs';
import {
  CreateBlockCodeGQL,
  GetBlockCodeGQL,
  GetBlocksCodeGQL,
  LoggerService,
  UpdateBlockCodeGQL,
} from 'shared-lib';
import { CodeFormService } from './code-form.service';

describe('CodeFormService', () => {
  let service: CodeFormService;
  let router: Router;
  let updateCode: UpdateBlockCodeGQL;

  const mockActions = {
    dispatch: jest.fn(),
  };
  const mockLoggerService = {
    error: jest.fn(),
  };
  const createCodeSource$ = new Subject();
  const mockCreateCodeSource = {
    mutate: jest.fn().mockReturnValue(createCodeSource$.asObservable()),
  };
  const updateCodeSource$ = new Subject();
  const mockUpdateCodeSource = {
    mutate: jest.fn().mockReturnValue(updateCodeSource$.asObservable()),
  };
  const mockGetCodes = { document: {} };
  const getCodeSource$ = new Subject();
  const mockGetCodeSource = {
    fetch: jest.fn().mockReturnValue(getCodeSource$.asObservable()),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: Actions, useValue: mockActions },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: CreateBlockCodeGQL, useValue: mockCreateCodeSource },
        { provide: UpdateBlockCodeGQL, useValue: mockUpdateCodeSource },
        { provide: GetBlocksCodeGQL, useValue: mockGetCodes },
        { provide: GetBlockCodeGQL, useValue: mockGetCodeSource },
        CodeFormService,
      ],
    });
    service = TestBed.inject(CodeFormService);
    router = TestBed.inject(Router);
    updateCode = TestBed.inject(UpdateBlockCodeGQL);
  });

  describe('createHandler', () => {
    const mockBlockCreateInput = {
      name: 'name',
      code: 'div { display: none; }',
      showLineNumbers: true,
      lang: 'css',
    };
    const mockCreatedBlockCode = {
      createBlockCode: {
        _id: '1',
        name: 'name',
      },
    };

    it('should call create block code mutation', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      const createSpy = jest.spyOn(service, 'create');

      service.createHandler(mockBlockCreateInput);

      const dataMap: any = createSpy.mock.calls[0][1];

      expect(createSpy).toHaveBeenLastCalledWith(
        mockBlockCreateInput,
        expect.any(Function),
      );
      expect(dataMap({ data: mockCreatedBlockCode })).toEqual(
        mockCreatedBlockCode.createBlockCode,
      );
      expect(dataMap({ data: null })).toEqual(undefined);
    }));
  });

  describe('updateHandler', () => {
    const mockBlockUpdateInput = {
      _id: '2',
      code: '<p>Hello</p>',
      lang: 'markup',
    };
    const mockUpdatedBlockCode = {
      updateBlockCode: {
        _id: '2',
        name: 'Markup code',
      },
    };

    it('should call update block code mutation', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      const updateSpy = jest.spyOn(service, 'update');

      service.updateHandler(mockBlockUpdateInput);

      const dataMap: any = updateSpy.mock.calls[0][1];

      expect(updateSpy).toHaveBeenLastCalledWith(
        mockBlockUpdateInput,
        expect.any(Function),
      );
      expect(dataMap({ data: mockUpdatedBlockCode })).toEqual(
        mockUpdatedBlockCode.updateBlockCode,
      );
      expect(dataMap({ data: null })).toEqual(undefined);
    }));
  });
});
