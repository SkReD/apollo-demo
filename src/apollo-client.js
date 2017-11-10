import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

export const client = new ApolloClient({
    link: new HttpLink({ uri: 'http://127.0.0.1:4000/graphql' }),
    cache: new InMemoryCache()
});