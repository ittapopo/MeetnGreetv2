/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { PrimaryButton } from './Styles';
import { MeetingList } from './MeetingList';
import { getNewMeetings } from './MeetingsData';
import { Page } from './Page';
import { PageTitle } from './PageTitle';

export const HomePage = () => (
    <Page>
        <div
            css={css`
                display: flex;
                align-items: center;
                justify-content: space-between;
            `}>
            <PageTitle>Unanswered Meeting</PageTitle>
            <PrimaryButton>Join meeting</PrimaryButton>
        </div>
        {/* <MeetingList data={getNewMeetings()} />} */}
    </Page>
);