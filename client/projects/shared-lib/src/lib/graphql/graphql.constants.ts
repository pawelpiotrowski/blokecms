import { ErrorPolicy } from '@apollo/client/core';
import { TypedDocumentNode } from 'apollo-angular';

export function gqlQueryRefetchOptions(
  query: TypedDocumentNode<unknown, unknown>,
) {
  return {
    errorPolicy: 'all' as ErrorPolicy,
    refetchQueries: [
      {
        query,
        variables: { repoFullName: 'apollographql/apollo-client' },
      },
    ],
  };
}
