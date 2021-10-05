/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { gray3, gray6 } from './Styles';
/** @jsxRuntime classic */
import { FC, useState, Fragment, useEffect } from 'react';
import { Page } from './Page';
import { RouteComponentProps } from 'react-router-dom';
import { MeetingData, getMeeting } from './MeetingsData';

interface RouteParams {
    meetingId: string;
}

export const MeetingPage: FC<RouteComponentProps<RouteParams>> = 
({ 
    match 
}) => {
    const [meeting, setMeeting]
    = useState<MeetingData | null>(null);

    useEffect(() => {
        const doGetMeeting = async (meetingId: number) => {
          const foundMeeting = await getMeeting(meetingId);
          setMeeting(foundMeeting);
        };
        if (match.params.meetingId) {
          const meetingId = Number(match.params.meetingId);
          doGetMeeting(meetingId);
        }
      }, [match.params.meetingId])

  return <Page>
      <div
    css={css`
      background-color: white;
      padding: 15px 20px 20px 20px;
      border-radius: 4px;
      border: 1px solid ${gray6};
      box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.16);
    `}
  >
    <div
      css={css`
        font-size: 19px;
        font-weight: bold;
        margin: 10px 0px 5px;
      `}
    >
      {meeting === null ? '' : meeting.title}
    </div>
    {meeting !== null && (
        <Fragment>
            <p
              css={css`
                margin-top: 0px;
                background-color: white;
              `}>
                  {meeting.content}
              </p>
              <div
                css={css`
                    font-size: 12px;
                    font-style: italic;
                    color: ${gray3};
                    `}>
                        {`Created by ${meeting.userName} on
                        ${meeting.created.toLocaleDateString()}
                        ${meeting.created.toLocaleTimeString()}`}
              </div>
        </Fragment>
    )}
  </div>
</Page>;
};