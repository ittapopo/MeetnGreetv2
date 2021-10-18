/** @jsxRuntime classic */
import React from 'react';
import { Page } from './Page';
import { Form } from './Form';
import { Field } from './Field';

export const AskPage = () => 
    <Page title="Create a meeting" >
        <Form submitCaption="Submit Meeting">
            <Field name="title" label="Title" />
            <Field name="content" label="Content" type="TextArea" />
        </Form>
    </Page>

export default AskPage;