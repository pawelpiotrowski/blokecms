import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Actions } from '@ngneat/effects-ng';
import { Subject } from 'rxjs';
import {
  CreateScriptGQL,
  GetScriptGQL,
  GetScriptsGQL,
  LoggerService,
  UpdateScriptGQL,
} from 'shared-lib';
import { ScriptFormService } from './script-form.service';

describe('ScriptFormService', () => {
  let service: ScriptFormService;
  let router: Router;
  let updateScript: UpdateScriptGQL;

  const mockActions = {
    dispatch: jest.fn(),
  };
  const mockLoggerService = {
    error: jest.fn(),
  };
  const createScriptSource$ = new Subject();
  const mockCreateScriptSource = {
    mutate: jest.fn().mockReturnValue(createScriptSource$.asObservable()),
  };
  const updateScriptSource$ = new Subject();
  const mockUpdateScriptSource = {
    mutate: jest.fn().mockReturnValue(updateScriptSource$.asObservable()),
  };
  const mockGetScripts = { document: {} };
  const getScriptSource$ = new Subject();
  const mockGetScriptSource = {
    fetch: jest.fn().mockReturnValue(getScriptSource$.asObservable()),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: Actions, useValue: mockActions },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: CreateScriptGQL, useValue: mockCreateScriptSource },
        { provide: UpdateScriptGQL, useValue: mockUpdateScriptSource },
        { provide: GetScriptGQL, useValue: mockGetScriptSource },
        { provide: GetScriptsGQL, useValue: mockGetScripts },
        ScriptFormService,
      ],
    });
    service = TestBed.inject(ScriptFormService);
    router = TestBed.inject(Router);
    updateScript = TestBed.inject(UpdateScriptGQL);
  });

  describe('createHandler', () => {
    const mockScriptCreateInput = {
      name: 'foo',
      formatted: 'html { margin: 0; }',
    };
    const mockCreatedScript = {
      createScript: {
        _id: '123',
        name: mockScriptCreateInput.name,
        formatted: mockScriptCreateInput.formatted,
      },
    };

    it('should call create script mutation', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      const createSpy = jest.spyOn(service, 'create');

      service.createHandler(mockScriptCreateInput);

      const dataMap: any = createSpy.mock.calls[0][1];

      expect(createSpy).toHaveBeenLastCalledWith(
        mockScriptCreateInput,
        expect.any(Function),
      );
      expect(dataMap({ data: mockCreatedScript })).toEqual(
        mockCreatedScript.createScript,
      );
      expect(dataMap({ data: null })).toEqual(undefined);
    }));
  });

  describe('updateHandler', () => {
    const mockScriptUpdateInput = {
      name: 'bar',
      _id: '321456',
    };
    const mockUpdatedScript = {
      updateScript: {
        _id: '321456',
        name: mockScriptUpdateInput.name,
      },
    };

    it('should call update script mutation', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      const updateSpy = jest.spyOn(service, 'update');

      service.updateHandler(mockScriptUpdateInput);

      const dataMap: any = updateSpy.mock.calls[0][1];

      expect(updateSpy).toHaveBeenLastCalledWith(
        mockScriptUpdateInput,
        expect.any(Function),
      );
      expect(dataMap({ data: mockUpdatedScript })).toEqual(
        mockUpdatedScript.updateScript,
      );
      expect(dataMap({ data: null })).toEqual(undefined);
    }));
  });

  describe('getUpdateHandler', () => {
    const mockScriptUpdateInput = {
      name: 'foobar',
      _id: '654321',
    };
    const mockUpdatedScript = {
      updateScript: mockScriptUpdateInput,
    };

    it('should get update script mutation', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      (updateScript.mutate as jest.Mock).mockClear();
      service.getUpdateHandler(mockScriptUpdateInput).subscribe();
      updateScriptSource$.next({
        loading: false,
        data: mockUpdatedScript,
      });
      tick();
      expect(updateScript.mutate).toHaveBeenCalled();
    }));
  });
});
