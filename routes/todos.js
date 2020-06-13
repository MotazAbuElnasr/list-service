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
  model: Todo,
  userIdPath: "assignee",
});

const todoPicker = pick([
  "title",
  "description",
  "state",
  "assignee",
  "dueDate",
  "deleted",
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
  authorizeTodoOwner("user._id"),
  async (req, res, next) => {
    const _id = req.params.id;
    Object.assign(req.body, { assignee: req.user._id });
    const todo = await Todo.findOneAndUpdate(
      { _id },
      { $set: todoPicker(req.body) }
    );
    if (!todo) throw NotFoundError(_id);
    res.json(todo);
  }
);

router.delete(
  "/:id",
  validateMongoId.fromParams("id"),
  authenticate,
  authorizeTodoOwner("user._id"),
  async (req, res, next) => {
    const _id = req.params.id;
    const todoData = pick(["deleted"])(req.body);
    const todo = await Todo.findOneAndDelete({ _id }, { $set: todoData });
    if (!todo) throw NotFoundError(_id);
    res.json(todo);
  }
);

module.exports = router;
