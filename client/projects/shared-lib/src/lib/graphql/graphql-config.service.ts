import { Inject, Injectable, Optional } from '@angular/core';
import { gqlConfig, GqlModuleConfig } from './graphql.interface';
import clientConfigJson from '../../../../../../config.client.json';

/**
 * This setup is required for server side rendering:
 * "URLs must be somehow converted to absolute when running on the server and be left relative when running in the browser."
 * See this good explanation full version here: https://github.com/ngx-translate/core/issues/1207#issuecomment-673921899
 *
 * Service here is needed to use DI for gqlConfig token set with gql module static forRoot method
 * Once rootConfig is checked and resolved this service is consumed by APOLLO_OPTIONS factory function
 * Because of that this service is not exported via public lib api
 */
@Injectable()
export class GqlConfigService {
  uri: string;
  private readonly defaultUri = '/graphql';

  constructor(@Optional() @Inject(gqlConfig) rootConfig: GqlModuleConfig) {
    this.uri =
      rootConfig && rootConfig.useAbsoluteUrl === true
        ? clientConfigJson.ssrAbsoluteUrl + this.defaultUri
        : this.defaultUri;
  }
}
