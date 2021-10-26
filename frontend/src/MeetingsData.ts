import { http } from './http';
import { getAccessToken } from './Auth';

export interface MeetingData {
    meetingId: number;
    title: string;
    content: string;
    userName: string;
    created: Date;
    guests: GuestData[];
  }

  export interface MeetingDataFromServer {
    meetingId: number;
    title: string;
    content: string;
    userName: string;
    created: string;
    guests: GuestData[];
  }

  export interface GuestData {
    guestId: number;
    content: string;
    userName: string;
    created: Date;
  }

  export const mapMeetingFromServer = (
    meeting: MeetingDataFromServer,
  ): MeetingData => ({
    ...meeting,
    created: new Date(meeting.created),
    guests: meeting.guests
      ? meeting.guests.map(guest => ({
      ...guest,
      created: new Date(guest.created),
    }))
    : [],
  });

/** export const getUnansweredMeetings = async (): Promise<MeetingData[]> => {
  let unansweredMeetings: MeetingData[] = [];

  await fetch('https://localhost:44357/api/meetings/unanswered')
  .then(res => res.json())
  .then(body => {
    unansweredMeetings = body;
  })
  .catch(err => {
    console.error(err);
  });
  return unansweredMeetings.map(meeting => ({
    ...meeting,
    created: new Date(meeting.created)
  }));
}; */

export const getUnansweredMeetings = async (): Promise<MeetingData[]> => {
      try {
        const result = await http<undefined, MeetingDataFromServer[]>({
          path: '/meetings/unanswered',
        });
        if (result.parsedBody) {
          return result.parsedBody.map(mapMeetingFromServer);
        } else {
          return [];
        }
      } catch (ex) {
        console.error(ex);
        return [];
      }
}; 

export const getMeeting = async (
  meetingId: number,
): Promise<MeetingData | null> => {
  try {
    const result = await http<undefined, MeetingDataFromServer>({
      path: `/meetings/${meetingId}`,
    });
    if (result.ok && result.parsedBody) {
      return mapMeetingFromServer(result.parsedBody);
    } else {
      return null;
    }
  } catch (ex) {
    console.error(ex);
    return null;
  }
};

export const searchMeetings = async (
  criteria: string,
): Promise<MeetingData[]> => {
  try {
    const result = await http<undefined, MeetingDataFromServer[]>({
      path: `/meetings?search=${criteria}`,
    });
    if (result.ok && result.parsedBody) {
      return result.parsedBody.map(mapMeetingFromServer);
    } else {
      return [];
    }
  } catch (ex) {
    console.error(ex);
    return [];
  }
};

export interface PostMeetingData {
  title: string;
  content: string;
  userName: string;
  created: Date;
}

export const postMeeting = async (
  meeting: PostMeetingData,
): Promise<MeetingData | undefined> => {
  const accessToken = await getAccessToken();
  try {
    const result = await http<PostMeetingData, MeetingDataFromServer>({
      path: '/meetings',
      method: 'post',
      body: meeting,
      accessToken,
    });
    if (result.ok && result.parsedBody) {
      return mapMeetingFromServer(result.parsedBody);
    } else {
      return undefined;
    }
  } catch (ex) {
    console.error(ex);
    return undefined;
  }
};

export interface PostAnswerData {
  meetingId: number;
  content: string;
  userName: string;
  created: Date;
}

export const postAnswer = async (
  answer: PostAnswerData,
): Promise<GuestData | undefined> => {
  const accessToken = await getAccessToken();
  try {
    const result = await http<PostAnswerData, GuestData>({
      path: '/meetings/guest',
      method: 'post',
      body: answer,
      accessToken
    });
    if (result.ok) {
      return result.parsedBody;
    } else {
      return undefined;
    }
  } catch (ex) {
    console.error(ex);
    return undefined;
  }
};