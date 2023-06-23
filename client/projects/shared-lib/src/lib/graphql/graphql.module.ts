import { ModuleWithProviders, NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS, APOLLO_FLAGS } from 'apollo-angular';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { gqlConfig, GqlModuleConfig } from './graphql.interface';
import { GqlConfigService } from './graphql-config.service';

// https://github.com/apollographql/apollo-feature-requests/issues/6#issuecomment-428560796
const cleanTypeName = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    const omitTypename = (key: string, value: unknown) =>
      key === '__typename' ? undefined : value;
    operation.variables = JSON.parse(
      JSON.stringify(operation.variables),
      omitTypename,
    );
  }
  return forward(operation).map((data) => {
    return data;
  });
});

@NgModule({
  exports: [ApolloModule],
  providers: [
    GqlConfigService,
    {
      provide: APOLLO_FLAGS,
      useValue: {
        useInitialLoading: true,
      },
    },
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink, config: GqlConfigService) {
        const http = httpLink.create({ uri: config.uri });

        return {
          cache: new InMemoryCache({
            addTypename: true,
            typePolicies: {
              Article: {
                fields: {
                  content: {
                    merge(_, incoming) {
                      return incoming;
                    },
                  },
                },
              },
              Page: {
                fields: {
                  articles: {
                    merge(_, incoming) {
                      return incoming;
                    },
                  },
                },
              },
              Navigation: {
                fields: {
                  links: {
                    merge(_, incoming) {
                      return incoming;
                    },
                  },
                },
              },
            },
          }),
          link: cleanTypeName.concat(http),
        };
      },
      deps: [HttpLink, GqlConfigService],
    },
  ],
})
export class SharedGraphQLModule {
  public static forRoot(
    moduleConfig: GqlModuleConfig,
  ): ModuleWithProviders<SharedGraphQLModule> {
    return {
      ngModule: SharedGraphQLModule,
      providers: [
        {
          provide: gqlConfig,
          useValue: moduleConfig,
        },
      ],
    };
  }
}
