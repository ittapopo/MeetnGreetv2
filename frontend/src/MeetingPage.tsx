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
        .withUrl('https://localhost:44357/meetingshub')
        .withAutomaticReconnect()
        .build();

      connection.on('Message', (message: string) => {
        console.log('Message', message);
      });
      connection.on('ReceiveMeeting', (meeting: MeetingDataFromServer) => {
        console.log('ReceiveMeeting', meeting);
        setMeeting(mapMeetingFromServer(meeting));
      });

      try {
        await connection.start();
      } catch (err) {
        console.log(err);
      }

      if (connection.state === HubConnectionState.Connected) {
        connection
          .invoke('SubscribeMeeting', meetingId)
          .catch((err: Error) => {
            return console.error(err.toString());
          });
      }
      return connection
    }

    const cleanUpSignalRconnection = async (
      meetingId: number,
      connection: HubConnection,
    ) => {
      if (connection.state === HubConnectionState.Connected) {
        try {
          await connection.invoke('UnsubscribeMeeting', meetingId);
        } catch (err) {
          return console.error(toString());
        }
        connection.off('Message');
        connection.off('ReceiveMeeting');
        connection.stop();
      } else {
        connection.off('Message');
        connection.off('ReceiveMeeting');
        connection.stop();
      }
    };

    useEffect(() => {
        const doGetMeeting = async (meetingId: number) => {
          const foundMeeting = await getMeeting(meetingId);
          setMeeting(foundMeeting);
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
      created: new Date(),
      attending: true
    });

    return { success: result ? true : false };
  }
  
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
              <AnswerList data={meeting.guests} />
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
        </Fragment>
    )}
  </div>
</Page>;
};