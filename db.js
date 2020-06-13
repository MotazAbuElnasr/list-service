const mongoose = require("mongoose");
require("express-async-errors");
const dbConnection = process.env.DB_URI || "mongodb://localhost/todo";
mongoose
  .connect(dbConnection, {
    autoIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to database !");
  })
  .catch((err) => {
    console.log(err);
  });
