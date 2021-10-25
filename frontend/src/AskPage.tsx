/** @jsxRuntime classic */
import React from 'react';
import { Page } from './Page';
import { Form, required, minLength, Values } from './Form';
import { Field } from './Field';
import { postMeeting } from './MeetingsData';

export const AskPage = () => {
  const handleSubmit = async (values: Values) => {
    const meeting = await postMeeting({
      title: values.title,
      content: values.content,
      userName: 'Fred',
      created: new Date(),
    });

    return { success: meeting ? true : false };
  };
  return (
    <Page title="Create a Meeting">
      <Form
        submitCaption="Submit Your Meeting"
        validationRules={{
          title: [{ validator: required }, { validator: minLength, arg: 10 }],
          content: [{ validator: required }, { validator: minLength, arg: 50 }],
        }}
        onSubmit={handleSubmit}
        failureMessage="There was a problem with your meeting"
        successMessage="Your meeting was successfully submitted"
      >
        <Field name="title" label="Title" />
        <Field name="content" label="Content" type="TextArea" />
      </Form>
    </Page>
  );
};
export default AskPage;