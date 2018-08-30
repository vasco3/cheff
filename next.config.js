const setIn = require('lodash/set');
// This file is not going through babel transformation.
// So, we write it in vanilla JS
// (But you could use ES2015 features supported by your Node.js version)
module.exports = {
  // exportPathMap: function exportPathMap() {
  //   return {
  //     '/': { page: '/' },
  //     '/about': { page: '/about' },
  //     '/recipes': { page: '/recipes' },
  //   };
  // },

  webpack: (config, { buildId, dev, isServer, defaultLoaders }) => {
    // Perform customizations to webpack config

    // for webtorrent
    setIn(config, 'node.fs', 'empty');
    // Important: return the modified config
    return config;
  },
};
