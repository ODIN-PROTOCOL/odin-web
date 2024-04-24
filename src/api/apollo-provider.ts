import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core'

import { API_CONFIG } from './api-config'

const cache = new InMemoryCache()

export const apolloClient = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: API_CONFIG.graphqlUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  }),
})

import { createApolloProvider } from '@vue/apollo-option'

export const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
})
