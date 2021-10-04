const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@font-size-base': '16px',
              '@primary-color': '#22C5FC',
              '@text-color': '#9F9F9F'
            },
            javascriptEnabled: true
          },
        },
      },
    },
  ],
};