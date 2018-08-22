import React from 'react';
import Head from 'next/head';
import { Typography } from 'rmwc/Typography';
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
      <Typography use="headline1">Cheff</Typography>
      <Cheff />
    </div>
  );
}
