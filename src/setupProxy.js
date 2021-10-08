const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware( '/api', {
      target: 'http://a6c8b8b3cbb2351fb.awsglobalaccelerator.com',
      changeOrigin: true,
      pathRewrite:{
        "^/api": ""
      }
    })
  );
};
