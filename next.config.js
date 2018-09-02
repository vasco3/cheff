const withCSS = require('@zeit/next-css');

const setIn = require('lodash/set');
// This file is not going through babel transformation.
// So, we write it in vanilla JS
// (But you could use ES2015 features supported by your Node.js version)
module.exports = withCSS({
  webpack: config => {
    // Perform customizations to webpack config

    // for webtorrent
    setIn(config, 'node.fs', 'empty');
    // Important: return the modified config
    return config;
  },
});
