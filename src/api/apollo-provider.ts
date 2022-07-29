import { ApolloClient, InMemoryCache } from '@apollo/client/core'

import { API_CONFIG } from './api-config'

const cache = new InMemoryCache()

export const apolloClient = new ApolloClient({
  cache,
  uri: API_CONFIG.graphqlUrl,
})

import { createApolloProvider } from '@vue/apollo-option'

export const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
})
