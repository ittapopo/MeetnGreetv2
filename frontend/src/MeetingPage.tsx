/** @jsxRuntime classic */
import React, { FC } from 'react';
import { Page } from './Page';
import { RouteComponentProps } from 'react-router-dom';

interface RouteParams {
    meetingId: string;
}

export const MeetingPage: FC<RouteComponentProps<RouteParams>> = 
({ 
    match 
}) => <Page>Meeting Page {match.params.meetingId}</Page>;