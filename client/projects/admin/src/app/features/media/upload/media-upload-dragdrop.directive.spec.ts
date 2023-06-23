import { MediaUploadDragDropDirective } from './media-upload-dragdrop.directive';

describe('MediaUploadDragDropDirective', () => {
  let directive: MediaUploadDragDropDirective;

  beforeEach(() => {
    directive = new MediaUploadDragDropDirective();
  });

  describe('dragOver', () => {
    it('should call preventDefault and stopPropagation on passed event and emit file drag over', () => {
      const mockEvent: any = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      };
      jest.spyOn(directive.fileDragOver, 'emit');

      directive.dragOver(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
      expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
      expect(directive.fileDragOver.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('dragLeave', () => {
    it('should call preventDefault and stopPropagation on passed event and emit file drag leave', () => {
      const mockEvent: any = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      };
      jest.spyOn(directive.fileDragLeave, 'emit');

      directive.dragLeave(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
      expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
      expect(directive.fileDragLeave.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('drop', () => {
    it('should return early if event is nullish or there are no files in event', () => {
      const mockNoDropEvent: any = null;
      const mockNoFilesDropEvent1: any = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      };
      const mockNoFilesDropEvent2: any = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        dataTransfer: {
          files: [],
        },
      };

      jest.spyOn(directive.fileDropped, 'emit');

      directive.drop(mockNoDropEvent);
      expect(directive.fileDropped.emit).not.toHaveBeenCalled();

      directive.drop(mockNoFilesDropEvent1);
      expect(directive.fileDropped.emit).not.toHaveBeenCalled();

      directive.drop(mockNoFilesDropEvent2);
      expect(directive.fileDropped.emit).not.toHaveBeenCalled();
    });

    it('should call preventDefault and stopPropagation on passed event and emit file dropped', () => {
      const mockEventWithFiles: any = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        dataTransfer: {
          files: [{}],
        },
      };
      jest.spyOn(directive.fileDropped, 'emit');

      directive.drop(mockEventWithFiles);

      expect(mockEventWithFiles.preventDefault).toHaveBeenCalledTimes(1);
      expect(mockEventWithFiles.stopPropagation).toHaveBeenCalledTimes(1);
      expect(directive.fileDropped.emit).toHaveBeenLastCalledWith(
        mockEventWithFiles.dataTransfer.files,
      );
    });
  });
});
