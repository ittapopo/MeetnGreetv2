/** @jsxRuntime classic */
import React, { FC, useEffect } from 'react';
import { Page } from './Page';
import { 
    Form, 
    required, 
    minLength, 
    Values,
    SubmitResult 
} from './Form';
import { Field } from './Field';
import { PostMeetingData, MeetingData } from './MeetingsData';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import {
    postMeetingActionCreator,
    AppState,
    clearPostedMeetingActionCreator
} from './Store';
import { AnyAction } from 'redux';

interface Props {
    postMeeting: (
        meeting: PostMeetingData,
    ) => Promise<void>;
    postedMeetingResult?: MeetingData;
    clearPostedMeeting: () => void;
}

const AskPage: FC<Props> = ({
    postMeeting,
    postedMeetingResult,
    clearPostedMeeting,
}) => {

    useEffect(() => {
        return function cleanUp() {
            clearPostedMeeting();
        };
    }, [clearPostedMeeting]);

    const handleSubmit = (values: Values) => {
        postMeeting({
            title: values.title,
            content: values.content,
            userName: 'Stian',
            created: new Date(),
            date: 'tomorrow', /** obsobs */
        });
    };

    let submitResult: SubmitResult | undefined;
    if (postedMeetingResult) {
        submitResult = { success: postedMeetingResult !== undefined };
    }
    return (
    <Page title="Create a meeting" >
        <Form 
          submitCaption="Submit Meeting"
          validationRules={{
              title: [
                  { validator: required },
                  { validator: minLength, arg: 10 }
              ],
              content: [
                  { validator: required },
                  { validator: minLength, arg: 50 }
              ],
          }}
          onSubmit={handleSubmit}
          submitResult={submitResult}
          failureMessage="There was a problem creating meeting"
          successMessage="Your meeting was successfully submitted"
        >
            <Field name="title" label="Title" />
            <Field name="content" label="Content" type="TextArea" />
        </Form>
    </Page>
    );
};

const mapStateToProps = (store: AppState) => {
    return {
        postedMeetingResult: store.meetings.postedResult,
    };
};
const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AnyAction>,
) => {
    return {
        postMeeting: (meeting: PostMeetingData) =>
          dispatch(postMeetingActionCreator(meeting)),
        clearPostedMeeting: () =>
          dispatch(clearPostedMeetingActionCreator()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
) (AskPage);