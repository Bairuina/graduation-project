
const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    proxy.createProxyMiddleware('/api', {
      target: 'http://127.0.0.1:7003',
      changeOrigin: true,
    })
  )
}
