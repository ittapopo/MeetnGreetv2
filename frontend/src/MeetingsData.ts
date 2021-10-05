export interface MeetingData {
    meetingId: number;
    title: string;
    date: string;
    content: string;
    userName: string;
    created: Date;
    guests: GuestData[];
  }

  export interface GuestData {
    guestId: number;
    content: string;
    userName: string;
    attending: boolean;
    created: Date;
  }

  const meetings: MeetingData[] = [
    {
      meetingId: 1,
      title: 'Status update meeting',
      date: 'Today, 14:00',
      content:
        'Quick breifing about the latest development',
      userName: 'Joe',
      created: new Date(),
      guests: [
        {
          guestId: 1,
          content: 'So excited about this! I will be there!',
          userName: 'Sarah',
          attending: true,
          created: new Date(),
        },
        {
          guestId: 2,
          content:
            'I can\'t make it this time. So sorry',
          userName: 'Fred',
          attending: false,
          created: new Date(),
        },
      ],
    },
    {
      meetingId: 2,
      title: 'Regarding the community potluck',
      date: 'TBA',
      content:
        'We still need more preperations',
      userName: 'Sue',
      created: new Date(),
      guests: [],
    },
  ];

export const getNewMeetings = async (): 
    Promise<MeetingData[]> => {
      await wait(500);
    return meetings.filter(m => m.guests.length === 0);
}

const wait = (ms: number ) : Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const getMeeting = async (
  meetingId: number
): Promise<MeetingData | null > => {
  await wait(500);
  const results
    = meetings.filter (m => m.meetingId === meetingId);
  return results.length === 0 ? null : results[0];
};