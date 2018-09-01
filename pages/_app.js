import React from 'react';
import App, { Container } from 'next/app';

import Layout from '../src/Layout';
import 'material-components-web/dist/material-components-web.min.css';
import 'react-vis/dist/style.css';
import '../styles/style.css';

const PAGE_TITLES = {
  default: 'Cheff',
  about: 'About',
  calculator: 'Calculator',
  plan: 'Meal Plan',
  recipes: 'Recipes',
  sync: 'Sync Data',
};

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps, router } = this.props;
    return (
      <Container>
        <Layout
          pageTitle={
            PAGE_TITLES[router.pathname.replace(/\//g, '')] ||
            PAGE_TITLES.default
          }
        >
          <Component {...pageProps} />
        </Layout>
      </Container>
    );
  }
}

export default MyApp;
