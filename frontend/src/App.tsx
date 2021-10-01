import React from 'react';
import { Header } from './Header';
import { HomePage } from './HomePage';
import { fontFamily, fontSize, gray2 } from './Styles';

/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';

// did it wørk?
function App() {
  return (
    <div
    css={css`
    font-family: ${fontFamily};
    font-size: ${fontSize};
    color: ${gray2};
  `}
    >
      <Header />
      <HomePage />
    </div>
  );
}

export default App;
