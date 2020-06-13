var express = require("express");
var router = express.Router();
const Todo = require("../models/Todo");
/* GET home page. */
router.get("/", function (req, res, next) {});
router.post("/", async function (req, res, next) {
  try {
    debugger;
    const todo = await new Todo(req.body).save();
    res.json(todo);
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
