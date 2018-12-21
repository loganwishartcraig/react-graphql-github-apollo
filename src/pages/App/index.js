import React, { Component } from 'react';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const GITHUB_BASE_URL = 'https://api.github.com/graphql';

const httpLink = new HttpLink({
  uri: GITHUB_BASE_URL,
  headers: {
    authorization: `Bearer ${
      process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
      }`
  }
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: httpLink,
  cache
})

class App extends Component {
  render() {
    return (
      <div>

      </div>
    );
  }
}

export default App;
