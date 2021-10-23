import { http } from './http';

export interface MeetingData {
    meetingId: number;
    title: string;

    content: string;
    userName: string;
    created: Date;
    guests: GuestData[];
  }

  export interface GuestData {
    guestId: number;
    content: string;
    userName: string;

    created: Date;
  }

  export interface MeetingDataFromServer {
    meetingId: number;
    title: string;
    content: string;
    userName: string;
    created: string;
    guests: GuestDataFromServer[];
  }

  export interface GuestDataFromServer {
    guestId: number;
    content: string;
    userName: string;
    created: string;
  }

  export const mapMeetingFromServer = (
    meeting: MeetingDataFromServer,
  ): MeetingData => ({
    ...meeting,
    created: new Date(meeting.created.substr(0, 19)),
    guests: meeting.guests.map(guest => ({
      ...guest,
      created: new Date(guest.created.substr(0, 19)),
    })),
  });

  const meetings: MeetingData[] = [
    {
      meetingId: 1,
      title: 'Status update meeting',

      content:
        'Quick breifing about the latest development',
      userName: 'Joe',
      created: new Date(),
      guests: [
        {
          guestId: 1,
          content: 'So excited about this! I will be there!',
          userName: 'Sarah',

          created: new Date(),
        },
        {
          guestId: 2,
          content:
            'I can\'t make it this time. So sorry',
          userName: 'Fred',

          created: new Date(),
        },
      ],
    },
    {
      meetingId: 2,
      title: 'Regarding the community potluck',

      content:
        'We still need more preperations',
      userName: 'Sue',
      created: new Date(),
      guests: [],
    },
  ];

export const GettingUnansweredMeetings = async (): 
    Promise<MeetingData[]> => {
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

const wait = (ms: number ) : Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const getMeeting = async (
  meetingId: number
): Promise<MeetingData | null > => {
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
    if (result.ok && result.parsedBody){
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
  date: string; /** obsobs */
}

export const postMeeting = async (
  meeting: PostMeetingData,
): Promise<MeetingData | undefined> => {
  await wait(500);
  const meetingId =
    Math.max(...meetings.map(m => m.meetingId)) + 1;
  const newMeeting: MeetingData = {
    ...meeting,
    meetingId,
    guests: [],
  };
  meetings.push(newMeeting);
  return newMeeting;
};

export interface PostAnswerData {
  meetingId: number;
  content: string;
  userName: string;
  created: Date;
  attending: boolean; /** obsobs */
}

export const postAnswer = async (
  answer: PostAnswerData,
): Promise<GuestData | undefined> => {
  await wait(500);
  const meeting = meetings.filter(
    m => m.meetingId === answer.meetingId,
  ) [0];
  const answerInMeeting: GuestData = {
    guestId: 99,
    ...answer,
  };
  meeting.guests.push(answerInMeeting);
  return answerInMeeting;
};