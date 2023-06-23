import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaUploadComponent } from './media-upload.component';

describe('MediaUploadComponent', () => {
  let component: MediaUploadComponent;
  let fixture: ComponentFixture<MediaUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MediaUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MediaUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('handle', () => {
    let onloadRef: Function | undefined;
    let onerrorRef: Function | undefined;
    const mockInputFileEvent: any = {
      target: {
        files: ['./test.png'],
      },
    };

    beforeAll(() => {
      window.URL.createObjectURL = jest.fn();
      window.URL.revokeObjectURL = jest.fn();
      Object.defineProperty(Image.prototype, 'onload', {
        get() {
          return this._onload;
        },
        set(onload: Function) {
          onloadRef = onload;
          this._onload = onload;
        },
      });
      Object.defineProperty(Image.prototype, 'onerror', {
        get() {
          return this._onerror;
        },
        set(onerror: Function) {
          onerrorRef = onerror;
          this._onerror = onerror;
        },
      });
    });

    it('should set draggingOver flag to false', () => {
      component.draggingOver = true;
      const mockFileInputEvent: any = {};

      fixture.detectChanges();

      component.handle(mockFileInputEvent);
      expect(component.draggingOver).toEqual(false);
    });

    it('should return early if event is nullish', () => {
      jest.spyOn(component.mediaAdded, 'emit');
      const mockNullishFileInputEvent: any = {};
      component.handle(mockNullishFileInputEvent);

      expect(component.mediaAdded.emit).not.toHaveBeenCalled();
    });

    it('should handle onload event and emit file', () => {
      jest.spyOn(component.mediaAdded, 'emit');
      component.handle({
        target: {
          files: ['./test.png'],
        },
      } as any);
      onloadRef!();
      expect(component.mediaAdded.emit).toHaveBeenLastCalledWith({
        file: './test.png',
        isPortrait: false,
        isSquare: true,
        naturalHeight: 0,
        naturalWidth: 0,
      });
    });

    it.todo('should handle onerror event');
  });
});
