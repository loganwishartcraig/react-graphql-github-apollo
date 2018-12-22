import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './pages/App';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from 'react-apollo';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { RetryLink } from 'apollo-link-retry';


const GITHUB_BASE_URL = 'https://api.github.com/graphql';

const httpLink = new HttpLink({
    uri: GITHUB_BASE_URL,
    headers: {
        authorization: `Bearer ${
            process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
            }`
    }
});

const errorLink = onError(({ graphQLErrors, networkError }) => {

    if (graphQLErrors) {
        console.error('[GraphQL] - graphQLErrors - ', graphQLErrors);
    }

    if (networkError) {
        console.error('[GraphQL] - networkError - ', networkError);
    }

});

const retryLink = new RetryLink({
    attempts: {
        max: 5,
        retryIf: (error) => !!error
    },
    delay: {
        initial: 300,
        max: 10000,
        jitter: true
    }
});

const cache = new InMemoryCache();

const link = ApolloLink.from([retryLink, errorLink, httpLink]);

const client = new ApolloClient({
    link,
    cache
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
