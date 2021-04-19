require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// parse request data content type application/x-www-form-rulencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse request data content type application/json
app.use(bodyParser.json());


// exceptions
const appError = require("./exception/appError");
// logs
const logger = require("./config/logger");
const httpLog = require("./config/httpLog");

// api settings
const apiPrefix = process.env.API_PREFIX || "api";
const apiVersion = process.env.API_VERSION || "v1";
const apiRoot = "/" + apiPrefix + "/" + apiVersion;

// middleware
app.use(httpLog);

// user routes
const userRoute = require("./apis/user/route");
app.use(apiRoot + "/users", userRoute);

app.all('*', (req, res, next) => {
    throw new appError(`Request url:${req.protocol}://${req.get('host')}${req.path} not found`, 404);
});

const errorHandler = require("./exception/errorHandler");
app.use(errorHandler);


// app server
const port = process.env.APP_PORT || 3000;
app.listen(port, () => {
  console.log("server up and running on PORT :", port);
  logger.info.info(`server up and running on PORT :${port}`);
});