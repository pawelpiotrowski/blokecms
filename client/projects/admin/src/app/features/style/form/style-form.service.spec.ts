import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Actions } from '@ngneat/effects-ng';
import { Subject } from 'rxjs';
import {
  CreateStyleGQL,
  GetStyleGQL,
  GetStylesGQL,
  LoggerService,
  UpdateStyleGQL,
} from 'shared-lib';
import { StyleFormService } from './style-form.service';

describe('StyleFormService', () => {
  let service: StyleFormService;
  let router: Router;
  let updateStyle: UpdateStyleGQL;

  const mockActions = {
    dispatch: jest.fn(),
  };
  const mockLoggerService = {
    error: jest.fn(),
  };
  const createStyleSource$ = new Subject();
  const mockCreateStyleSource = {
    mutate: jest.fn().mockReturnValue(createStyleSource$.asObservable()),
  };
  const updateStyleSource$ = new Subject();
  const mockUpdateStyleSource = {
    mutate: jest.fn().mockReturnValue(updateStyleSource$.asObservable()),
  };
  const mockGetStyles = { document: {} };
  const getStyleSource$ = new Subject();
  const mockGetStyleSource = {
    fetch: jest.fn().mockReturnValue(getStyleSource$.asObservable()),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: Actions, useValue: mockActions },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: CreateStyleGQL, useValue: mockCreateStyleSource },
        { provide: UpdateStyleGQL, useValue: mockUpdateStyleSource },
        { provide: GetStyleGQL, useValue: mockGetStyleSource },
        { provide: GetStylesGQL, useValue: mockGetStyles },
        StyleFormService,
      ],
    });
    service = TestBed.inject(StyleFormService);
    router = TestBed.inject(Router);
    updateStyle = TestBed.inject(UpdateStyleGQL);
  });

  describe('createHandler', () => {
    const mockStyleCreateInput = {
      name: 'foo',
      formatted: 'html { margin: 0; }',
    };
    const mockCreatedStyle = {
      createStyle: {
        _id: '123',
        name: mockStyleCreateInput.name,
        formatted: mockStyleCreateInput.formatted,
      },
    };

    it('should call create style mutation', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      const createSpy = jest.spyOn(service, 'create');

      service.createHandler(mockStyleCreateInput);

      const dataMap: any = createSpy.mock.calls[0][1];

      expect(createSpy).toHaveBeenLastCalledWith(
        mockStyleCreateInput,
        expect.any(Function),
      );
      expect(dataMap({ data: mockCreatedStyle })).toEqual(
        mockCreatedStyle.createStyle,
      );
      expect(dataMap({ data: null })).toEqual(undefined);
    }));
  });

  describe('updateHandler', () => {
    const mockStyleUpdateInput = {
      name: 'bar',
      _id: '321456',
    };
    const mockUpdatedStyle = {
      updateStyle: {
        _id: '321456',
        name: mockStyleUpdateInput.name,
      },
    };

    it('should call update style mutation', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      const updateSpy = jest.spyOn(service, 'update');

      service.updateHandler(mockStyleUpdateInput);

      const dataMap: any = updateSpy.mock.calls[0][1];

      expect(updateSpy).toHaveBeenLastCalledWith(
        mockStyleUpdateInput,
        expect.any(Function),
      );
      expect(dataMap({ data: mockUpdatedStyle })).toEqual(
        mockUpdatedStyle.updateStyle,
      );
      expect(dataMap({ data: null })).toEqual(undefined);
    }));
  });

  describe('getUpdateHandler', () => {
    const mockStyleUpdateInput = {
      name: 'foobar',
      _id: '654321',
    };
    const mockUpdatedStyle = {
      updateStyle: mockStyleUpdateInput,
    };

    it('should get update style mutation', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      (updateStyle.mutate as jest.Mock).mockClear();
      service.getUpdateHandler(mockStyleUpdateInput).subscribe();
      updateStyleSource$.next({
        loading: false,
        data: mockUpdatedStyle,
      });
      tick();
      expect(updateStyle.mutate).toHaveBeenCalled();
    }));
  });
});
