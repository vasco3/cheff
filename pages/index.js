import React from 'react';
import Head from 'next/head';
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
} from 'rmwc/TopAppBar';

import Cheff from '../src/Cheff';

export default function HomePage() {
  return (
    <div>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          href="https://fonts.googleapis.com/css?family=Quattrocento"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/utilities.min.css"
          rel="stylesheet"
        />
        <link
          href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css"
          rel="stylesheet"
        />
      </Head>
      <TopAppBar dense>
        <TopAppBarRow>
          <TopAppBarSection>
            <TopAppBarTitle>Cheff</TopAppBarTitle>
          </TopAppBarSection>
        </TopAppBarRow>
      </TopAppBar>

      <div className="mdc-top-app-bar--dense-fixed-adjust">
        <Cheff />
      </div>
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
        }
        :root {
          --mdc-theme-primary: rgb(253, 103, 33);
        }
      `}</style>
    </div>
  );
}
