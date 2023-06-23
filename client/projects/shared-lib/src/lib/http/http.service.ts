import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { LoggerService } from '../logger/logger.service';
import {
  HttpMethod,
  HttpRequestOptionals,
  HttpRequestOptions,
} from './http.interface';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly defaultOptions: HttpRequestOptions = {
    observe: 'body',
    responseType: 'json',
  };

  constructor(private httpClient: HttpClient, private logger: LoggerService) {}

  get<T>(path: string): Observable<T> {
    return this.request<T>(path, 'GET');
  }

  post<T>(path: string, data: any): Observable<T> {
    return this.request<T>(path, 'POST', { data });
  }

  private request<T>(
    path: string,
    method: HttpMethod,
    optionals?: HttpRequestOptionals,
  ): Observable<T | never> {
    const options: HttpRequestOptions = {
      ...this.defaultOptions,
      ...(optionals && optionals.data && { body: optionals.data }),
    };

    return this.httpClient.request(method, path, options).pipe(
      // DEBUG
      catchError((err: HttpErrorResponse) => {
        this.logger.error(
          `API Error Http ${method} request to ${path}`,
          HttpService.name,
        );
        return throwError(() => err);
      }),
      tap(() => {
        this.logger.log(
          `API Http ${method} request to ${path}`,
          HttpService.name,
        );
      }),
    );
  }
}
