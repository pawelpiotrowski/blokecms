import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApiService } from 'shared-lib';
import {
  PageContentEntityToolbarButtonAction,
  PageContentEntityToolbarButtons,
} from '../../../layout/page-content-entity-layout/page-content-entity-layout.interface';
import { PageEntityContentRepository } from '../../../layout/page-content-entity-layout/page-entity-content.repository';
import { MediaFormComponent } from './media-form.component';
import { MediaFormService } from './media-form.service';

describe('MediaFormComponent', () => {
  let component: MediaFormComponent;
  let fixture: ComponentFixture<MediaFormComponent>;
  let mediaFormService: MediaFormService;
  let entityRepo: PageEntityContentRepository;
  let apiService: ApiService;

  const mockMediaFormService = {
    toggleSaveButton: jest.fn(),
    toggleResetButton: jest.fn(),
    uploadCreateHandler: jest.fn(),
    uploadUpdateHandler: jest.fn(),
    uploadErrorHandler: jest.fn(),
  };

  const mockBlockMediaEdit = { _id: '1', name: 'foo', url: 'url' };
  const mockBlockMediaNew = { _id: '', name: '', url: '' };

  const buttonsAction$ =
    new BehaviorSubject<PageContentEntityToolbarButtonAction>(null);
  const mockEntityRepository = {
    buttonsAction$,
  };

  const uploadSource$ = new Subject();
  const mockApiService = {
    upload: jest.fn().mockReturnValue(uploadSource$.asObservable()),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MediaFormComponent],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: MediaFormService, useValue: mockMediaFormService },
        {
          provide: PageEntityContentRepository,
          useValue: mockEntityRepository,
        },
      ],
    })
      .overrideComponent(MediaFormComponent, {
        set: {
          providers: [
            { provide: MediaFormService, useValue: mockMediaFormService },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MediaFormComponent);
    mediaFormService = TestBed.inject(MediaFormService);
    entityRepo = TestBed.inject(PageEntityContentRepository);
    apiService = TestBed.inject(ApiService);
    component = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should disable save and reset buttons and subscribe to entity button actions', () => {
      jest.spyOn(entityRepo.buttonsAction$, 'subscribe');
      fixture.detectChanges();
      expect(mediaFormService.toggleSaveButton).toHaveBeenLastCalledWith(false);
      expect(mediaFormService.toggleResetButton).toHaveBeenLastCalledWith(
        false,
      );
      expect(entityRepo.buttonsAction$.subscribe).toHaveBeenCalledTimes(1);
    });

    it('should set isEdit to true if blockMedia has _id', () => {
      component.blockMedia = mockBlockMediaEdit;
      fixture.detectChanges();

      expect(component.isEdit).toEqual(true);
    });

    it('should set isEdit to false if blockMedia has NO _id', () => {
      component.blockMedia = mockBlockMediaNew;
      fixture.detectChanges();

      expect(component.isEdit).toEqual(false);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from entity repo updates', () => {
      fixture.detectChanges();
      // when subscribed currently both actions are resulting with buttons being disabled
      buttonsAction$.next(PageContentEntityToolbarButtons.Save);
      expect(mediaFormService.toggleSaveButton).toHaveBeenLastCalledWith(false);
      (mediaFormService.toggleSaveButton as jest.Mock).mockClear();
      component.ngOnDestroy();

      buttonsAction$.next(PageContentEntityToolbarButtons.Save);
      expect(mediaFormService.toggleSaveButton).not.toHaveBeenCalled();
    });
  });

  describe('onMediaAdded', () => {
    it('should store media file event and set preview using FileReader', () => {
      jest
        .spyOn(FileReader.prototype, 'readAsDataURL')
        .mockImplementation(() => jest.fn());
      fixture.detectChanges();

      const mockMediaUploadFile = {
        file: {} as File,
        naturalHeight: 100,
        naturalWidth: 200,
        isPortrait: false,
        isSquare: false,
      };

      component.onMediaAdded(mockMediaUploadFile);
      expect(component.mediaUploadFile).toEqual(mockMediaUploadFile);
      expect(FileReader.prototype.readAsDataURL).toHaveBeenLastCalledWith(
        mockMediaUploadFile.file,
      );
    });
  });

  describe('resetAction', () => {
    it('should null media upload preview and media file event and disable reset and save buttons', () => {
      fixture.detectChanges();

      const mockMediaUploadFile = {
        file: {} as File,
        naturalHeight: 100,
        naturalWidth: 200,
        isPortrait: false,
        isSquare: false,
      };

      component.onMediaAdded(mockMediaUploadFile);
      buttonsAction$.next(PageContentEntityToolbarButtons.Reset);
      expect(component.mediaUploadFilePreview).toEqual(null);
      expect(component.mediaUploadFile).toEqual(null);
      expect(mediaFormService.toggleResetButton).toHaveBeenLastCalledWith(
        false,
      );
      expect(mediaFormService.toggleSaveButton).toHaveBeenLastCalledWith(false);
    });
  });

  describe('saveAction', () => {
    const mockMediaUploadFile = {
      file: { name: 'foo' } as File,
      naturalHeight: 100,
      naturalWidth: 200,
      isPortrait: false,
      isSquare: false,
    };

    it('should null media upload preview and media file event and disable reset and save buttons', () => {
      fixture.detectChanges();

      component.onMediaAdded(mockMediaUploadFile);
      buttonsAction$.next(PageContentEntityToolbarButtons.Save);
      expect(mediaFormService.toggleResetButton).toHaveBeenCalledWith(false);
      expect(mediaFormService.toggleSaveButton).toHaveBeenCalledWith(false);
      const formData = new FormData();
      const { file, ...meta } = mockMediaUploadFile;

      formData.append('file', file);
      formData.append('name', file.name);
      Object.entries(meta).forEach(([key, value]) => {
        formData.append(key, `${value}`);
      });
      expect(apiService.upload).toHaveBeenLastCalledWith(formData);
    });

    it('should call upload update handler when in edit mode', () => {
      component.blockMedia = mockBlockMediaEdit;
      fixture.detectChanges();

      component.onMediaAdded(mockMediaUploadFile);

      buttonsAction$.next(PageContentEntityToolbarButtons.Save);
      uploadSource$.next({ foo: 'bar' });
      expect(mediaFormService.uploadUpdateHandler).toHaveBeenLastCalledWith(
        {
          foo: 'bar',
        },
        mockBlockMediaEdit._id,
      );
    });

    it('should call upload create handler when NOT edit mode', () => {
      component.blockMedia = mockBlockMediaNew;
      fixture.detectChanges();

      component.onMediaAdded(mockMediaUploadFile);

      buttonsAction$.next(PageContentEntityToolbarButtons.Save);
      uploadSource$.next({ bar: 'foo' });
      expect(mediaFormService.uploadCreateHandler).toHaveBeenLastCalledWith({
        bar: 'foo',
      });
    });
  });

  describe('fileReaderOnLoadHandler', () => {
    it('should set media file preview and enable reset and save buttons', () => {
      fixture.detectChanges();

      const result = { bar: 'foo' };
      component['fileReaderOnLoadHandler']({ target: { result } } as any);

      expect(component.mediaUploadFilePreview).toEqual(result);
      expect(mediaFormService.toggleResetButton).toHaveBeenLastCalledWith(true);
      expect(mediaFormService.toggleSaveButton).toHaveBeenLastCalledWith(true);
    });
  });

  describe('uploadErrorHandler', () => {
    it('should call media form service upload error handler', () => {
      fixture.detectChanges();

      component['uploadErrorHandler']('Error');

      expect(mediaFormService.uploadErrorHandler).toHaveBeenLastCalledWith(
        'Error',
      );
    });
  });
});
