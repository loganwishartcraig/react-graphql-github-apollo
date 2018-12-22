import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Loading from '../../components/Loading';
import RepositoryList from '../Repository/RepositoryList';
import ErrorMessage from '../../components/Error';

const GET_REPOSITORIES_OF_CURRENT_USER = gql`
    {
        viewer {
            repositories(
                first: 5
                orderBy: { direction: DESC, field: STARGAZERS }
            ) {
                edges {
                    node {
                        id
                        name
                        url
                        descriptionHTML
                        primaryLanguage {
                            name
                        }
                        owner {
                            login
                            url
                        }
                        stargazers {
                            totalCount
                        }
                        viewerHasStarred
                        watchers {
                            totalCount
                        }
                        viewerSubscription
                    }
                }
            }
        }
    }
`;

const Profile = () => (

    <Query query={GET_REPOSITORIES_OF_CURRENT_USER}>
        {({ data, loading, error }) => {

            if (error) {
                return <ErrorMessage error={error} />
            }

            const { viewer } = data;

            if (loading || !viewer) {
                return <Loading />;
            }

            return (
                <RepositoryList repositories={viewer.repositories} />
            );

        }}
    </Query>

);

export default Profile;
