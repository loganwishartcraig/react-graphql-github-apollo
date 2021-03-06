import React from 'react';
import gql from 'graphql-tag';
import ErrorMessage from '../../../components/Error';
import Loading from '../../../components/Loading';
import { Query } from 'react-apollo';
import IssueItem from '../IssueItem';
import { ButtonUnobtrusive } from '../../../components/Button';
import { withState } from 'recompose';

const ISSUE_STATES = {
    NONE: 'NONE',
    OPEN: 'OPEN',
    CLOSED: 'CLOSED',
};

const isShow = issueState => issueState !== ISSUE_STATES.NONE;

const GET_ISSUES_OF_REPOSITORY = gql`
    query(
        $repositoryOwner: String!,
        $repositoryName: String!,
        $issueState: IssueState!
    ) {
        repository(name: $repositoryName, owner: $repositoryOwner) {
            issues(first: 5, states: [$issueState]) {
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

const TRANSITION_LABELS = {
    [ISSUE_STATES.NONE]: 'Show Open Issues',
    [ISSUE_STATES.OPEN]: 'Show Closed Issues',
    [ISSUE_STATES.CLOSED]: 'Hide Issues',
};


const TRANSITION_STATE = {
    [ISSUE_STATES.NONE]: ISSUE_STATES.OPEN,
    [ISSUE_STATES.OPEN]: ISSUE_STATES.CLOSED,
    [ISSUE_STATES.CLOSED]: ISSUE_STATES.NONE,
};

const Issues = ({
    repositoryOwner,
    repositoryName,
    issueState,
    onChangeIssueState
}) => (
        <div className="Issues">

            <ButtonUnobtrusive
                onClick={() => onChangeIssueState(TRANSITION_STATE[issueState])}
            >
                {TRANSITION_LABELS[issueState]}
            </ButtonUnobtrusive>

            {isShow(issueState) && (
                <Query
                    query={GET_ISSUES_OF_REPOSITORY}
                    variables={{
                        repositoryName,
                        repositoryOwner,
                        issueState
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

                        const filteredRepository = {
                            issues: {
                                edges: repository.issues.edges.filter(
                                    issue => issue.node.state === issueState
                                ),
                            },
                        };

                        if (!filteredRepository.issues.edges.length) {
                            return <div className="IssueList">No issues...</div>;
                        }

                        return <IssueList issues={filteredRepository.issues} />;

                    }}
                </Query>
            )}

        </div>
    );

const IssueList = ({ issues }) => (
    <div className="IssueList">
        {issues.edges.map(({ node }) =>
            <IssueItem key={node.id} issue={node} />
        )}
    </div>
);

export default withState(
    'issueState',
    'onChangeIssueState',
    ISSUE_STATES.NONE
)(Issues);
