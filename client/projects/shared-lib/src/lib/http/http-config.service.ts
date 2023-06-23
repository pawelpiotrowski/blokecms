import { Inject, Injectable, Optional } from '@angular/core';
import { httpConfig, HttpModuleConfig } from './http.interface';
import clientConfigJson from '../../../../../../config.client.json';

/**
 * This setup is required for server side rendering:
 * "URLs must be somehow converted to absolute when running on the server and be left relative when running in the browser."
 * See this good explanation full version here: https://github.com/ngx-translate/core/issues/1207#issuecomment-673921899
 *
 * Service here is needed to use DI for httpConfig token set with http module static forRoot method and is not exported via public lib api
 */
@Injectable({
  providedIn: 'root',
})
export class HttpConfigService {
  uri: string;
  private readonly defaultUri = '/api';

  constructor(@Optional() @Inject(httpConfig) rootConfig: HttpModuleConfig) {
    this.uri =
      rootConfig && rootConfig.useAbsoluteUrl === true
        ? clientConfigJson.ssrAbsoluteUrl + this.defaultUri
        : this.defaultUri;
  }
}
