const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware( '/api', {
      target: 'https://ac.bitbow.net',
      changeOrigin: true,
      pathRewrite:{
        "^/api": ""
      }
    })
  );
};
