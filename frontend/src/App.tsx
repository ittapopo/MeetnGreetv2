/** @jsxRuntime classic */
import React, { lazy, Suspense } from 'react';
import { HeaderWithRouter as Header } from './Header';
import { HomePage } from './HomePage';
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { fontFamily, fontSize, gray2 } from './Styles';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { SearchPage } from './SearchPage';
import { SignInPage } from './SignInPage';
import { NotFoundPage } from './NotFoundPage';
import { MeetingPage } from './MeetingPage';
const AskPage = lazy(() => import('./AskPage')); 

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
    <Switch>
      <Redirect from="/home" to="/" />
      <Route exact path="/" component={HomePage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/ask">
        <Suspense
          fallback={
            <div
              css={css`
                margin-top: 100px;
                text-align: center;
                `}>
                  Loading...
            </div>
          }>
            <AskPage />
        </Suspense>
      </Route>
      <Route path="/signin" component={SignInPage} />
      <Route path="/meetings/:meetingId" component={MeetingPage} />
      <Route component={NotFoundPage} />
    </Switch>
    </div>
    </BrowserRouter>
  );
}

export default App;
