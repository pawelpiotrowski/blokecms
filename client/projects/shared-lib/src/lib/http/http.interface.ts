import { InjectionToken } from '@angular/core';

export type HttpMethod =
  | 'GET'
  | 'DELETE'
  | 'HEAD'
  | 'JSONP'
  | 'OPTIONS'
  | 'POST'
  | 'PUT'
  | 'PATCH';

export interface HttpRequestOptionals {
  data?: any;
}

export interface HttpRequestHeaders {
  [header: string]: string | string[];
}

export interface HttpRequestParams {
  [param: string]: string | string[];
}

export interface HttpRequestRetry {
  method: HttpMethod;
  options: HttpRequestOptions;
  path: string;
}

/**
 * For returning types depending on
 * `observe` and `responseType properties
 * see: https://angular.io/api/common/http/HttpClient#request
 */
export interface HttpRequestOptions {
  body?: any;
  headers?: HttpRequestHeaders;
  observe?: 'body' | 'events' | 'response';
  params?: HttpRequestParams;
  reportProgress?: boolean;
  responseType: 'arraybuffer' | 'blob' | 'json' | 'text';
  withCredentials?: boolean;
}

export interface HttpModuleConfig {
  useAbsoluteUrl: boolean;
}

export const httpConfig = new InjectionToken<HttpModuleConfig>('httpConfig');
