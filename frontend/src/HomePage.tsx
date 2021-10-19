/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { PrimaryButton } from './Styles';
import { MeetingList } from './MeetingList';
import { MeetingData } from './MeetingsData';
import { Page } from './Page';
import { PageTitle } from './PageTitle';
import { useEffect, FC } from 'react';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import {
    getUnansweredMeetingsActionCreator,
    AppState
} from './Store';

interface Props extends RouteComponentProps {
    getUnansweredMeetings: () => Promise<void>;
    meetings: MeetingData[] | null;
    meetingsLoading: boolean;
}

const HomePage:FC<Props> = ({ 
    history,
    meetings,
    meetingsLoading,
    getUnansweredMeetings 
}) => {
    useEffect(() => {
        if (meetings === null) {
            getUnansweredMeetings();
        }
    }, [meetings, getUnansweredMeetings]);

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

const mapStateToProps = (store: AppState) => {
    return {
        meetings: store.meetings.unanswered,
        meetingsLoading: store.meetings.loading
    };
};

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AnyAction>,
) => {
    return {
        getUnansweredMeetings: () =>
          dispatch(getUnansweredMeetingsActionCreator()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
) (HomePage);