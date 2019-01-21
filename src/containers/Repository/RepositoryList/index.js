import React from 'react';
import FetchMore from '../../../components/FetchMore';
import RepositoryItem from '../RepositoryItem';
import '../style.css';
import Issues from '../../Issue';



const getUpdateQuery = entry => (
    previousResult,
    { fetchMoreResult }
) => {

    if (!fetchMoreResult) return previousResult;

    return {
        ...previousResult,
        [entry]: {
            ...previousResult[entry],
            repositories: {
                ...previousResult[entry].repositories,
                ...fetchMoreResult[entry].repositories,
                edges: [
                    ...previousResult[entry].repositories.edges,
                    ...fetchMoreResult[entry].repositories.edges
                ]
            }
        }
    }

};

const RepositoryList = ({
    repositories,
    fetchMore,
    loading,
    entry
}) => (

        <React.Fragment>
            {repositories.edges.map(({ node }) => (
                <div key={node.id} className="RepositoryItem">
                    <RepositoryItem {...node}></RepositoryItem>

                    <Issues
                        repositoryName={node.name}
                        repositoryOwner={node.owner.login}
                    />
                </div>
            ))}



            <FetchMore
                loading={loading}
                hasNextPage={repositories.pageInfo.hasNextPage}
                variables={{
                    cursor: repositories.pageInfo.endCursor
                }}
                updateQuery={getUpdateQuery(entry)}
                fetchMore={fetchMore}
            >
                Repositories
        </FetchMore>

        </React.Fragment>



    );

export default RepositoryList;
