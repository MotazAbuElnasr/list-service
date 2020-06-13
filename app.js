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

app.use("/", todoRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  console.error(err);
  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
