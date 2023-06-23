import { uploadFileInterceptorForDiskStorage } from './upload.constants';

describe('uploadFileInterceptorForDiskStorage', () => {
  let interceptor: typeof uploadFileInterceptorForDiskStorage;

  beforeEach(() => {
    interceptor = uploadFileInterceptorForDiskStorage;
  });

  it('should provide correct destination', () => {
    expect(interceptor.destination).toEqual('./ui-files');
  });

  it('should provide filename method', () => {
    const { filename } = interceptor;
    const mockCallback = jest.fn();
    const mockFile: any = { originalname: 'test.jpg' };

    filename(null, mockFile, mockCallback);

    expect(mockCallback).toHaveBeenCalledWith(
      null,
      expect.stringContaining('.jpg'),
    );
  });
});
