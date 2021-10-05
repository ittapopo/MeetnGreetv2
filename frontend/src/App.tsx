import React from 'react';
import { Header } from './Header';
import { HomePage } from './HomePage';
import { fontFamily, fontSize, gray2 } from './Styles';
import { BrowserRouter, Route } from 'react-router-dom';
import { AskPage } from './AskPage';
import { SearchPage } from './SearchPage';
import { SignInPage } from './SignInPage';

/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';

function App() {
  return (
    <BrowserRouter>
    <div
    css={css`
    font-family: ${fontFamily};
    font-size: ${fontSize};
    color: ${gray2};
  `}>
      <Header />
      <Route exact path="/" component={HomePage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/ask" component={AskPage} />
      <Route path="/signin" component={SignInPage} />
    </div>
    </BrowserRouter>
  );
}

export default App;
