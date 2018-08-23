import React from 'react';
import Head from 'next/head';

import Cheff from '../src/Cheff';

function HomePage() {
  return (
    <React.Fragment>
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
      <Cheff />
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
    </React.Fragment>
  );
}

export default HomePage;
