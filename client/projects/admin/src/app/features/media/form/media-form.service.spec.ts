import { fakeAsync, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Actions } from '@ngneat/effects-ng';
import { Subject } from 'rxjs';
import {
  LoggerService,
  CreateBlockMediaGQL,
  UpdateBlockMediaGQL,
  GetBlocksMediaGQL,
  GetBlockMediaGQL,
} from 'shared-lib';
import { appDisplayErrorMessage } from '../../../app.actions';
import { MediaFormService } from './media-form.service';

describe('MediaFormService', () => {
  let service: MediaFormService;
  let actions: Actions;
  let router: Router;
  let logger: LoggerService;
  let updateMedia: UpdateBlockMediaGQL;

  const mockActions = {
    dispatch: jest.fn(),
  };
  const mockLoggerService = {
    error: jest.fn(),
  };
  const createMediaSource$ = new Subject();
  const mockCreateMediaSource = {
    mutate: jest.fn().mockReturnValue(createMediaSource$.asObservable()),
  };
  const updateMediaSource$ = new Subject();
  const mockUpdateMediaSource = {
    mutate: jest.fn().mockReturnValue(updateMediaSource$.asObservable()),
  };
  const mockGetMedias = { document: {} };
  const getMediaSource$ = new Subject();
  const mockGetMediaSource = {
    fetch: jest.fn().mockReturnValue(getMediaSource$.asObservable()),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: Actions, useValue: mockActions },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: CreateBlockMediaGQL, useValue: mockCreateMediaSource },
        { provide: UpdateBlockMediaGQL, useValue: mockUpdateMediaSource },
        { provide: GetBlocksMediaGQL, useValue: mockGetMedias },
        { provide: GetBlockMediaGQL, useValue: mockGetMediaSource },
        MediaFormService,
      ],
    });
    service = TestBed.inject(MediaFormService);
    actions = TestBed.inject(Actions);
    router = TestBed.inject(Router);
    logger = TestBed.inject(LoggerService);
    updateMedia = TestBed.inject(UpdateBlockMediaGQL);
  });

  describe('uploadCreateHandler', () => {
    const mockApiUploadData = {
      url: 'url',
      name: 'name',
      isPortrait: false,
      isSquare: false,
      naturalHeight: 100,
      naturalWidth: 200,
    };
    const mockCreatedBlockMedia = {
      createBlockMedia: {
        _id: '1',
        url: 'url',
        name: 'name',
      },
    };

    it('should call create block media mutation', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      const createSpy = jest.spyOn(service, 'create');

      service.uploadCreateHandler(mockApiUploadData);

      const dataMap: any = createSpy.mock.calls[0][1];

      expect(createSpy).toHaveBeenLastCalledWith(
        mockApiUploadData,
        expect.any(Function),
      );
      expect(dataMap({ data: mockCreatedBlockMedia })).toEqual(
        mockCreatedBlockMedia.createBlockMedia,
      );
      expect(dataMap({ data: null })).toEqual(undefined);
    }));
  });

  describe('uploadUpdateHandler', () => {
    const mockApiUploadData = {
      url: 'lru',
      name: 'eman',
      isPortrait: true,
      isSquare: false,
      naturalHeight: 200,
      naturalWidth: 100,
    };
    const mockBlockMediaId = '2';
    const mockUpdatedBlockMedia = {
      updateBlockMedia: {
        _id: mockBlockMediaId,
        url: 'lru',
        name: 'eman',
      },
    };

    it('should call update block media mutation', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      const updateSpy = jest.spyOn(service, 'update');

      service.uploadUpdateHandler(mockApiUploadData, mockBlockMediaId);

      const dataMap: any = updateSpy.mock.calls[0][1];

      expect(updateSpy).toHaveBeenLastCalledWith(
        {
          ...mockApiUploadData,
          _id: mockBlockMediaId,
        },
        expect.any(Function),
      );
      expect(dataMap({ data: mockUpdatedBlockMedia })).toEqual(
        mockUpdatedBlockMedia.updateBlockMedia,
      );
      expect(dataMap({ data: null })).toEqual(undefined);
    }));
  });

  describe('uploadErrorHandler', () => {
    it('should dispatch error message re-enable buttons and log error', () => {
      (actions.dispatch as jest.Mock).mockClear();
      jest.spyOn(service, 'toggleSaveButton').mockImplementationOnce(() => {});
      jest.spyOn(service, 'toggleResetButton').mockImplementationOnce(() => {});
      service.uploadErrorHandler('Error');
      const message = 'Error uploading file, please try again';

      expect(actions.dispatch).toHaveBeenLastCalledWith(
        appDisplayErrorMessage({ message }),
      );
      expect(service.toggleResetButton).toHaveBeenLastCalledWith(true);
      expect(service.toggleSaveButton).toHaveBeenLastCalledWith(true);
      expect(logger.error).toHaveBeenLastCalledWith(
        message,
        MediaFormService.name,
        'Error',
      );
    });
  });
});
