import React from 'react';
import Link from '../../../components/Link';

import '../style.css';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Button from '../../../components/Button';
import { REPOSITORY_FRAGMENT } from '..';

const STAR_REPOSITORY = gql`
    mutation($id: ID!) {
        addStar(input: { starrableId: $id}) {
            starrable {
                id
                viewerHasStarred
            }
        }
    }
`;

const UNSTAR_REPOSITORY = gql`
    mutation($id: ID!) {
        removeStar(input: { starrableId: $id}) {
            starrable {
                id
                viewerHasStarred
            }
        }
    }
`;

const UPDATE_REPOSITORY_SUBSCRIPTION = gql`
    mutation($id: ID!, $state: SubscriptionState!) {
        updateSubscription(input: { subscribableId: $id, state: $state }) {
            subscribable {
                id
                viewerCanSubscribe
                viewerSubscription
            }
        }
    }
`;

const WATCH_REPOSITORY = gql`
    mutation($id: ID!, $viewerSubscription: SubscriptionState!) {
        updateSubscription(
            input: { state: $viewerSubscription, subscribableId: $id }
        ) {
            subscribable {
                id
                viewerSubscription
            }
        }
    }
`;

const VIEWER_SUBSCRIPTIONS = {
    SUBSCRIBED: 'SUBSCRIBED',
    UNSUBSCRIBED: 'UNSUBSCRIBED'
};

const isWatch = viewerSubscription =>
    viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED;

const updateWatch = (
    client,
    {
        data: {
            updateSubscription: {
                subscribable: { id, viewerSubscription }
            }
        }
    }
) => {

    const repository = client.readFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT
    });

    let { totalCount } = repository.watchers;

    totalCount = isWatch(viewerSubscription) ? totalCount++ : totalCount--;

    client.writeFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
        data: {
            ...repository,
            watchers: {
                ...repository.watchers,
                totalCount
            }
        }
    });

};

const updateAddStar = (
    client,
    { data: { addStar: { starrable: { id } } } }
) => {

    const repository = client.readFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT
    });

    const totalCount = repository.stargazers.totalCount + 1;

    client.writeFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
        data: {
            ...repository,
            stargazers: {
                ...repository.stargazers,
                totalCount
            }
        }
    });

};

const updateRemoveStar = (
    client,
    { data: { removeStar: { starrable: { id } } } }
) => {

    const repository = client.readFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT
    });

    const totalCount = repository.stargazers.totalCount - 1;

    client.writeFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
        data: {
            ...repository,
            stargazers: {
                ...repository.stargazers,
                totalCount
            }
        }
    });

};

const updateAddSubscription = (
    client,
    { data: { updateSubscription: { subscribable: { id } } } }
) => {

    const repository = client.readFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT
    });

    const totalCount = repository.watchers.totalCount + 1;

    client.writeFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
        data: {
            ...repository,
            watchers: {
                ...repository.watchers,
                totalCount
            }
        }
    });

};

const updateRemoveSubscription = (
    client,
    { data: { updateSubscription: { subscribable: { id } } } }
) => {

    const repository = client.readFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT
    });

    const totalCount = repository.watchers.totalCount - 1;

    client.writeFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
        data: {
            ...repository,
            watchers: {
                ...repository.watchers,
                totalCount
            }
        }
    });

};


const RepositoryItem = ({
    id,
    name,
    url,
    descriptionHTML,
    primaryLanguage,
    owner,
    stargazers,
    watchers,
    viewerSubscription,
    viewerHasStarred
}) => (
        <div>
            <div className="RepositoryItem-title">
                <h2>
                    <Link href={url}>{name}</Link>
                </h2>

                <div>

                    {!viewerHasStarred ? (
                        <Mutation
                            mutation={STAR_REPOSITORY}
                            variables={{ id }}
                            update={updateAddStar}
                            optimisticResponse={{
                                addStar: {
                                    __typename: 'Mutation',
                                    starrable: {
                                        __typename: 'Repository',
                                        id,
                                        viewerHasStarred: true
                                    }
                                }
                            }}
                        >
                            {(addStar, { data, loading, error }) =>
                                <Button
                                    className={'RepositoryItem-title-action'}
                                    onClick={addStar}
                                >
                                    {stargazers.totalCount} Star{(stargazers.totalCount === 1 ? '' : 's')}
                                </Button>
                            }
                        </Mutation>
                    ) : (
                            <Mutation
                                mutation={UNSTAR_REPOSITORY}
                                variables={{ id }}
                                update={updateRemoveStar}
                                optimisticResponse={{
                                    removeStar: {
                                        __typename: 'Mutation',
                                        starrable: {
                                            __typename: 'Repository',
                                            id,
                                            viewerHasStarred: false
                                        }
                                    }
                                }}
                            >
                                {(removeStar, { data, loading, error }) =>
                                    <Button
                                        className={'RepositoryItem-title-action'}
                                        onClick={removeStar}
                                    >
                                        {stargazers.totalCount} Star{(stargazers.totalCount === 1 ? '' : 's')}
                                        {' '}
                                        (Unstar)
                            </Button>
                                }
                            </Mutation>
                        )
                    }

                    {viewerSubscription !== 'SUBSCRIBED' ? (
                        <Mutation
                            mutation={UPDATE_REPOSITORY_SUBSCRIPTION}
                            variables={{ id, state: 'SUBSCRIBED' }}
                            update={updateAddSubscription}
                        >
                            {(addSub, { data, loading, error }) =>
                                <Button
                                    className={'RepositoryItem-title-action'}
                                    onClick={addSub}
                                >
                                    {watchers.totalCount} Watcher{(watchers.totalCount === 1 ? '' : 's')}
                                </Button>
                            }
                        </Mutation>
                    ) : (
                            <Mutation
                                mutation={UPDATE_REPOSITORY_SUBSCRIPTION}
                                variables={{ id, state: 'UNSUBSCRIBED' }}
                                update={updateRemoveSubscription}
                            >
                                {(removeSub, { data, loading, error }) =>
                                    <Button
                                        className={'RepositoryItem-title-action'}
                                        onClick={removeSub}
                                    >
                                        {watchers.totalCount} Watcher{(watchers.totalCount === 1 ? '' : 's')}
                                        {' '}
                                        (Unwatch)
                            </Button>
                                }
                            </Mutation>
                        )
                    }

                    {
                        <Mutation
                            mutation={WATCH_REPOSITORY}
                            variables={{
                                id,
                                viewerSubscription: isWatch(viewerSubscription)
                                    ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
                                    : VIEWER_SUBSCRIPTIONS.SUBSCRIBED

                            }}
                            update={updateWatch}
                            optimisticResponse={{
                                updateSubscription: {
                                    __typename: 'Mutation',
                                    subscribable: {
                                        __typename: 'Repository',
                                        id,
                                        viewerSubscription: isWatch(viewerSubscription)
                                            ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
                                            : VIEWER_SUBSCRIPTIONS.SUBSCRIBED
                                    }
                                }

                            }}
                        >
                            {(updateSubscription, { data, loading, error }) => (
                                <Button
                                    className="RepositoryItem-title-action"
                                    onClick={updateSubscription}
                                >
                                    {watchers.totalCount}{' '}
                                    {isWatch(viewerSubscription) ? 'Unwatch' : 'Watch'}
                                </Button>
                            )}
                        </Mutation>
                    }


                </div>

            </div>
            <div className="RepositoryItem-description">
                <div
                    className="RepositoryItem-description-info"
                    dangerouslySetInnerHTML={{ __html: descriptionHTML }}
                />
                <div className="RepositoryItem-description-details">
                    <div>
                        {primaryLanguage && (
                            <span>Language: {primaryLanguage.name}</span>
                        )}
                    </div>
                    <div>
                        {owner && (
                            <span>Owner: <a href={owner.url}>{owner.login}</a></span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

export default RepositoryItem;
