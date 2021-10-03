/** @jsxRuntime classic */
import { FC } from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { MeetingData } from './MeetingsData';
import { gray3 } from './Styles';

interface Props {
    data: MeetingData;
}

export const Meeting: FC<Props> = ({ data }) => (
    <div
        css={css`
            padding: 10px 0px;
        `}>
        <div
            css={css`
                padding: 10px 0px;
                font-size: 19px;
            `}>
            {data.title}
        </div>
        <div
            css={css`
                font-size: 12px;
                font-style: italic;
                color: ${gray3};
            `}>
                {`Asked by ${data.userName} on
                    ${data.created.toLocaleDateString()}
                    ${data.created.toLocaleTimeString()}`}
        </div>
    </div>
)