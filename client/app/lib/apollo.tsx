'use client';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

// Server URL can be overridden via NEXT_PUBLIC_API_URL from .env
const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql';

export const client = new ApolloClient({
  link: new HttpLink({ uri: url }),
  cache: new InMemoryCache(),
});
