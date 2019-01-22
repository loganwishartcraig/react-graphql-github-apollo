import React from 'react';
import Link from '../../../components/Link';

const IssueItem = ({ issue }) => (

    <div className="IssueItem">

        {/* Placeholder to add a show/hide comment button later */}

        <div className="IssueItem-content">
            <h3>
                <Link href={issue.url}>{issue.title}</Link>
            </h3>
            <div dangerouslySetInnerHTML={{ __html: issue.bodyHTML }}></div>
        </div>

        {/* Placeholder to render a list of comments later */}

    </div>

);

export default IssueItem;
