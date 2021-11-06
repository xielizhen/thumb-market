const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#FFD571',
              '@link-color': '#7474AA',
              '@text-color': '#f7f7f7',
              '@error-color': '#FF4B4B',
              '@border-radius-base': '2px'
            },
            javascriptEnabled: true
          },
        },
      },
    },
  ],
};