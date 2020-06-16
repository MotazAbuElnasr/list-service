var express = require("express");
var router = express.Router();
const Todo = require("../models/Todo");
const { TODO_PER_PAGE } = require("../constants/todoConstants");
const { pick } = require("../helpers/generalHelpers");
const { NotFoundError } = require("../errors/ErrorsFactory")("Todo");

const {
  validateMongoId,
  authenticate,
  authorizeOwner,
} = require("../middlewares");

const authorizeTodoOwner = authorizeOwner({
  Model: Todo,
  userIdPath: "assignee",
});

const todoPicker = pick([
  "title",
  "description",
  "state",
  "assignee",
  "dueDate",
]);

router.get("/", async function (req, res, next) {
  const lastId = req.query.lastId;
  const query = lastId ? { _id: { $gt: lastId } } : {};
  const count = await Todo.find().countDocuments();
  const todos = await Todo.find(query, { title: 1 }).limit(TODO_PER_PAGE);
  res.json({ todos, count });
});

router.get("/:id", validateMongoId.fromParams("id"), async function (
  req,
  res,
  next
) {
  const _id = req.params.id;
  const todo = await Todo.findById(_id);
  if (!todo) throw NotFoundError(_id);
  res.json(todo);
});

router.post("/", authenticate, async (req, res, next) => {
  Object.assign(req.body, { assignee: req.user._id });
  const todo = await new Todo(todoPicker(req.body)).save();
  res.json(todo);
});

router.patch(
  "/:id",
  validateMongoId.fromParams("id"),
  authenticate,
  authorizeTodoOwner("params.id"),
  async (req, res, next) => {
    Object.assign(req.body, { assignee: req.user._id });
    Object.assign(req.requestedDoc, { ...todoPicker(req.body) });
    const newDoc = await req.requestedDoc.save();
    res.json(newDoc);
  }
);

router.delete(
  "/:id",
  validateMongoId.fromParams("id"),
  authenticate,
  authorizeTodoOwner("params.id"),
  async (req, res, next) => {
    const todoData = pick(["deleted"])(req.body);
    Object.assign(req.requestedDoc, { ...todoData });
    const newDoc = await req.requestedDoc.save();
    res.json(newDoc);
  }
);

module.exports = router;
