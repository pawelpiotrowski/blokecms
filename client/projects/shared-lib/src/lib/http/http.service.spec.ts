import { TestBed, getTestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpService } from './http.service';
import { LoggerService } from '../logger/logger.service';

describe('HttpService', () => {
  let service: HttpService;
  let httpMock: HttpTestingController;
  const testApiUrl = '/api';
  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: LoggerService, useValue: mockLogger }],
    });
    service = TestBed.inject(HttpService);
    httpMock = getTestBed().inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should make http GET request for given path', () => {
      service.get(testApiUrl).subscribe();
      const req = httpMock.expectOne(testApiUrl);

      expect(req.request.method).toBe('GET');
      expect(req.request.url).toBe(testApiUrl);
    });
  });

  describe('post', () => {
    it('should make http POST request for given path', () => {
      const testPostApiParamsData = { test: 'test' };
      service.post(testApiUrl, testPostApiParamsData).subscribe();
      const req = httpMock.expectOne(testApiUrl);

      expect(req.request.method).toBe('POST');
      expect(req.request.url).toBe(testApiUrl);
      expect(req.request.body).toBe(testPostApiParamsData);
      // expect(loggerService.log).toBeCalled();
    });
  });

  describe('error', () => {
    it('should re-throw caught error', () => {
      const mockErrorResponse = { status: 400, statusText: 'Bad Request' };
      service.get(testApiUrl).subscribe({
        next: () => null,
        error: (err) => {
          expect(err).toEqual(new Error(err.message));
        },
      });
      httpMock.expectOne(testApiUrl).flush('', mockErrorResponse);

      service.post(testApiUrl, {}).subscribe({
        next: () => null,
        error: (err) => {
          expect(err).toEqual(new Error(err.message));
        },
      });
      httpMock.expectOne(testApiUrl).flush('', mockErrorResponse);
      //  expect(loggerService.error).toBeCalledTimes(2);
    });
  });
});
