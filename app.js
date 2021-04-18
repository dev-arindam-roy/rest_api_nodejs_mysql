require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// parse request data content type application/x-www-form-rulencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse request data content type application/json
app.use(bodyParser.json());

// api settings
const apiPrefix = process.env.API_PREFIX || "api";
const apiVersion = process.env.API_VERSION || "v1";
const apiRoot = "/" + apiPrefix + "/" + apiVersion;

// user routes
const userRoute = require("./apis/user/route");
app.use(apiRoot + "/users", userRoute);


// app server settings
const port = process.env.APP_PORT || 3000;
app.listen(port, () => {
  console.log("server up and running on PORT :", port);
});