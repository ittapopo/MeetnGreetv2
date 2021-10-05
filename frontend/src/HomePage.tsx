/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { PrimaryButton } from './Styles';
import { MeetingList } from './MeetingList';
import { getNewMeetings, MeetingData } from './MeetingsData';
import { Page } from './Page';
import { PageTitle } from './PageTitle';
import { useEffect, useState, FC } from 'react';
import { RouteComponentProps } from 'react-router';

export const HomePage:FC<RouteComponentProps> = ({ history }) => {
    const [meetings, setMeetings] = useState<MeetingData[] | null>(null);
    const [meetingsLoading, setMeetingsLoading] = useState(true);

    useEffect(() => {
        const doGetNewMeetings = async () => {
            const newMeetings = await getNewMeetings();
            setMeetings(newMeetings);
            setMeetingsLoading(false);
        };
        doGetNewMeetings();
    }, []);

const handleCreateMeetingClick = () => {
    history.push('/ask');
};

   return ( 
    <Page>
        <div
            css={css`
                display: flex;
                align-items: center;
                justify-content: space-between;
            `}>
            <PageTitle>Unanswered Meeting</PageTitle>
            <PrimaryButton onClick={handleCreateMeetingClick}>
                Create Meeting
            </PrimaryButton>
        </div>
        {meetingsLoading ? (
            <div
                css={css`
                    font-size: 16px;
                    font-style: italic;
                `}
            >
                Loading...
            </div>
        ) : (
        <MeetingList data={meetings || []} />
        )}
    </Page>
  );
};