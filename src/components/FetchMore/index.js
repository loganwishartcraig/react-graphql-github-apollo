import React from 'react';
import { ButtonUnobtrusive } from '../Button';
import Loading from '../Loading';

const FetchMore = ({
    variables,
    updateQuery,
    fetchMore,
    loading,
    hasNextPage,
    children
}) => (

        <div className="FetchMore">

            {loading ? (
                <Loading />
            ) : (
                    hasNextPage && (
                        <ButtonUnobtrusive
                            className="FetchMore-button"
                            onClick={() => fetchMore({ variables, updateQuery })}
                        >
                            More {children}
                        </ButtonUnobtrusive>
                    )
                )}


        </div>
    )

export default FetchMore;
