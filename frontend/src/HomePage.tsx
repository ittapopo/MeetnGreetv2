/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { PrimaryButton } from './Styles';
import { MeetingList } from './MeetingList';
import { GettingUnansweredMeetings, MeetingData } from './MeetingsData';
import { Page } from './Page';
import { PageTitle } from './PageTitle';
import { useEffect, useState, FC } from 'react';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { useAuth } from './Auth';

export const HomePage: FC<RouteComponentProps> = ({ history }) => {
    const [meetings, setMeetings] = useState<MeetingData[] | null>(null);
    const [meetingsLoading, setMeetingsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const doGetUnansweredMeetings = async () => {
            const unansweredMeetings = await GettingUnansweredMeetings();
            if (!cancelled) {
                setMeetings(unansweredMeetings);
                setMeetingsLoading(false);
            }
        };
        doGetUnansweredMeetings();
        return () => {
            cancelled = true;
        };
    }, []);

    const handleCreateMeetingClick = () => {
        history.push('/ask');
    };

    const { isAuthenticated } = useAuth();

    return (
        <Page>
            <div
              css={css`
              display: flex;
              align-items: center;
              justify-content: space-between;
            `}
            >
                <PageTitle>Unanswered Meetings</PageTitle>
                {isAuthenticated && (
                    <PrimaryButton onClick={handleCreateMeetingClick}>
                    Create a meeting
                    </PrimaryButton>
                )}
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