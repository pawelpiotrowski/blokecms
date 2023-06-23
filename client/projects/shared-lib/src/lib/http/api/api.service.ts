import { Injectable } from '@angular/core';
import { HttpConfigService } from '../http-config.service';
import { HttpService } from '../http.service';
import { ApiUpload, ApiVersion } from './api.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private httpService: HttpService,
    private config: HttpConfigService,
  ) {}

  version() {
    return this.httpService.get<ApiVersion>(this.config.uri);
  }

  upload(data: FormData) {
    return this.httpService.post<ApiUpload>(`${this.config.uri}/upload`, data);
  }
}
