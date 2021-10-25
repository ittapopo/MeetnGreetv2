/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { gray3, gray6 } from './Styles';
/** @jsxRuntime classic */
import { FC, useState, Fragment, useEffect } from 'react';
import { Page } from './Page';
import { RouteComponentProps } from 'react-router-dom';
import { 
  MeetingData, 
  getMeeting, 
  postAnswer,
  mapMeetingFromServer,
  MeetingDataFromServer } from './MeetingsData';
import { AnswerList } from './AnswerList';
import { Form, required, minLength, Values } from './Form';
import { Field } from './Field';
import {
  HubConnectionBuilder,
  HubConnectionState,
  HubConnection,
} from '@aspnet/signalr';
import { server } from './AppSettings';
import { useAuth } from './Auth';

interface RouteParams {
    meetingId: string;
}

export const MeetingPage: FC<RouteComponentProps<RouteParams>> = 
({ 
    match 
}) => {
    const [meeting, setMeeting]
    = useState<MeetingData | null>(null);

    const setUpSignalRConnection = async (meetingId: number) => {
      const connection = new HubConnectionBuilder()
        .withUrl(`${server}/meetingshub`)
        .withAutomaticReconnect()
        .build();

      connection.on('Message', (message: string) => {
        console.log('Message', message);
      });
      connection.on('ReceiveMeeting', (meeting: MeetingDataFromServer) => {
        console.log('ReceiveMeeting', meeting);
        setMeeting(mapMeetingFromServer(meeting));
      });

      async function start() {
      try {
        await connection.start();
      } catch (err) {
        console.log(err);
      }
    }
    await start();

      if (connection.state === HubConnectionState.Connected) {
        connection
          .invoke('SubscribeMeeting', meetingId)
          .catch((err: Error) => {
            return console.error(err.toString());
          });
      }
      return connection
    }

    const cleanUpSignalRconnection = (
      meetingId: number,
      connection: HubConnection,
    ) => {
      if (connection.state === HubConnectionState.Connected) {
        connection
          .invoke('UnsubscribeMeeting', meetingId)
          .then(() => {
            connection.off('Message');
            connection.off('ReceiveMeeting');
            connection.stop();
          })
          .catch ((err: Error) => {
          return console.error(err.toString());
        });
      } else {
        connection.off('Message');
        connection.off('ReceiveMeeting');
        connection.stop();
      }
    };

    useEffect(() => {
      let cancelled = false;
        const doGetMeeting = async (meetingId: number) => {
          const foundMeeting = await getMeeting(meetingId);
          if (!cancelled) {
            setMeeting(foundMeeting);
          }
        };
        let connection: HubConnection;
        if (match.params.meetingId) {
          const meetingId = Number(match.params.meetingId);
          doGetMeeting(meetingId);
          setUpSignalRConnection(meetingId).then(con => {
            connection = con;
          });
        }

        return function cleanUp() {
          cancelled = true;
          if (match.params.meetingId) {
            const meetingId = Number(match.params.meetingId);
            cleanUpSignalRconnection(meetingId, connection);
          }
        };
      }, [match.params.meetingId])

  const handleSubmit = async (values: Values) => {
    const result = await postAnswer({
      meetingId: meeting!.meetingId,
      content: values.content,
      userName: 'Fred',
      created: new Date()
    });

    return { success: result ? true : false };
  };
  
const { isAuthenticated } = useAuth();

  return (
  <Page>
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
              <AnswerList data={meeting.guests} />
              {isAuthenticated && (
              <div
                css={css`
                  margin-top: 20px;
                  `}
                >
                  <Form 
                   submitCaption="Submit Your Answer"
                   validationRules={{
                     content: [
                       { validator: required },
                       { validator: minLength, arg: 50 }
                     ]
                   }}
                   onSubmit={handleSubmit}
                   failureMessage="There was a problem with your answer"
                   successMessage="Your answer was successfully submitted"
                  >
                    <Field name="content" label="Your Answer" type="TextArea" />
                  </Form>
                </div>
                )}
        </Fragment>
    )}
  </div>
</Page>
  );
};