const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:8001",
      changeOrigin: true,
    })
  );
};

// const proxy = {
//   target: "https://api.industryguru.in",
//   changeOrigin: true,
// };
// module.exports = function (app) {
//   app.use("/api", createProxyMiddleware(proxy));
// };
