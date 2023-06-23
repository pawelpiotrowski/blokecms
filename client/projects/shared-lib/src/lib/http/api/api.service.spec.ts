import { TestBed } from '@angular/core/testing';
import { HttpConfigService } from '../http-config.service';
import { HttpService } from '../http.service';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpService: HttpService;
  const httpServiceMock = {
    get: jest.fn(),
    post: jest.fn(),
  };
  const httpConfigMock = {
    uri: 'test',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpService, useValue: httpServiceMock },
        { provide: HttpConfigService, useValue: httpConfigMock },
      ],
    });
    service = TestBed.inject(ApiService);
    httpService = TestBed.inject(HttpService);
  });

  describe('version', () => {
    it('should call http get with correct url', () => {
      service.version();
      expect(httpService.get).toHaveBeenLastCalledWith(httpConfigMock.uri);
    });
  });

  describe('upload', () => {
    it('should call http post with correct url', () => {
      const mockUploadData = new FormData();

      service.upload(mockUploadData);
      expect(httpService.post).toHaveBeenLastCalledWith(
        `${httpConfigMock.uri}/upload`,
        mockUploadData,
      );
    });
  });
});
