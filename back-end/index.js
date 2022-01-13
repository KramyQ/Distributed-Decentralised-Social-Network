"use strict";

var path = require("path");
var http = require("http");

var oas3Tools = require("oas3-tools");
var serverPort = 8000;

// swaggerRouter configuration
var options = {
  routing: {
    controllers: path.join(__dirname, "./controllers"),
  },
};

var expressAppConfig = oas3Tools.expressAppConfig(
  path.join(__dirname, "api/openapi.yaml"),
  options
);
var app = expressAppConfig.getApp();
app.use((req, res, next) => {
  const origin = req.get("origin");
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma"
  );
  next();
});

// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
  console.log(
    "Your server is listening on port %d (http://localhost:%d/Sr05-Project/Distributed_Facebook_API/1.0.0/)",
    serverPort,
    serverPort
  );
  console.log(
    "Swagger-ui is available on http://localhost:%d/docs",
    serverPort
  );
});
