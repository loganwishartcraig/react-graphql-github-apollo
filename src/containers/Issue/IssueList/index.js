import React from 'react';
import gql from 'graphql-tag';
import ErrorMessage from '../../../components/Error';
import Loading from '../../../components/Loading';
import { Query } from 'react-apollo';
import IssueItem from '../IssueItem';

const GET_ISSUES_OF_REPOSITORY = gql`
    query($repositoryOwner: String!, $repositoryName: String!) {
        repository(name: $repositoryName, owner: $repositoryOwner) {
            issues(first: 5) {
                edges {
                    node {
                        id
                        number
                        state
                        title
                        url
                        bodyHTML
                    }
                }
            }
        }
    }
`;

const Issues = ({
    repositoryOwner,
    repositoryName
}) => (
        <div className="Issues">
            <Query
                query={GET_ISSUES_OF_REPOSITORY}
                variables={{
                    repositoryName,
                    repositoryOwner
                }}
            >
                {({ data, loading, error }) => {

                    if (error) {
                        return <ErrorMessage error={error}></ErrorMessage>
                    }

                    const { repository } = data;

                    if (loading && !repository) {
                        return <Loading />;
                    }

                    if (!repository.issues.edges.length) {
                        return <div className="IssueList">No issues...</div>;
                    }

                    return <IssueList issues={repository.issues} />;

                }}
            </Query>
        </div>
    );

const IssueList = ({ issues }) => (
    <div className="IssueList">
        {issues.edges.map(({ node }) =>
            <IssueItem key={node.id} issue={node} />
        )}
    </div>
);

export default Issues;