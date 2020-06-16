var createError = require("http-errors");
var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const sanitizer = require("sanitize").middleware;
require("express-async-errors");
require("./db");
var todoRouter = require("./routes/todos");

var app = express();
app.use(sanitizer);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/todo", todoRouter);
// error handler
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
