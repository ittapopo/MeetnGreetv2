/** @jsxRuntime classic */
import { FC, useState, useEffect} from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Page } from './Page';
import { MeetingList } from './MeetingList';
import { searchMeetings, MeetingData } from './MeetingsData';
/** @jsx jsx */
import { css, jsx} from '@emotion/react';

export const SearchPage: FC<RouteComponentProps> = ({
    location,
}) => {
    const [meetings, setMeetings] = useState<MeetingData[]>([]);

    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get('criteria') || '';

    useEffect(() => {
        const doSearch = async (criteria: string) => {
            const foundResults = await searchMeetings(criteria);
            setMeetings(foundResults);
        };
        doSearch(search);
    }, [search]);

    return (
        <Page title="Search Results">
        {search && (
            <p
              css={css`
              font-size: 16px;
              font-style: italic;
              margin-top: 0px;
            `}
            >
                for "{search}"
            </p>
          )}
            <MeetingList data={meetings} />
            </Page>
        );
};