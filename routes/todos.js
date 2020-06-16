var express = require("express");
var router = express.Router();
const Todo = require("../models/Todo");
const { TODO_PER_PAGE } = require("../constants/todoConstants");
const { pick } = require("../helpers/generalHelpers");
const { NotFoundError: TodoNotFoundError } = require("../errors/ErrorsFactory")(
  "Todo"
);
const { NotFoundError: UserNotFoundError } = require("../errors/ErrorsFactory")(
  "User"
);
const {
  validateMongoId,
  authenticate,
  authorizeOwner,
} = require("../middlewares");
const { doesUserExist } = require("../helpers/todoHelpers");

const authorizeTodoOwner = authorizeOwner({
  Model: Todo,
  userIdPath: "assignee",
});
const todoBasicAttr = ["title", "description", "state", "assignee", "dueDate"];
const todoPicker = pick(todoBasicAttr);
const deletedTodoPicker = pick(["deleted"]);
const originalTodoPicker = pick([...todoBasicAttr, "deleted"]);

router.get("/", async function (req, res, next) {
  const lastId = req.query.lastId;
  const query = lastId ? { _id: { $gt: lastId } } : {};
  const count = await Todo.find().countDocuments();
  const todos = await Todo.find(query, { title: 1 }).limit(TODO_PER_PAGE);
  res.json({ todos, count });
});

router.get(
  "/:id",
  validateMongoId.fromParams({ property: "id" }),
  async function (req, res, next) {
    const _id = req.params.id;
    const todo = await Todo.findById(_id);
    if (!todo) throw TodoNotFoundError(_id);
    res.json(todo);
  }
);

router.post("/", authenticate, async (req, res, next) => {
  Object.assign(req.body, { assignee: req.user._id });
  const todo = await new Todo(todoPicker(req.body)).save();
  res.json(todo);
});

router.patch(
  "/:id",
  validateMongoId.fromParams({ property: "id" }),
  validateMongoId.fromBody({ property: "assignee", optional: true }),
  authenticate,
  authorizeTodoOwner("params.id"),
  async (req, res, next) => {
    const { assignee } = req.body;
    if (assignee && !(await doesUserExist(assignee)))
      throw UserNotFoundError(assignee);
    const _originalDoc = originalTodoPicker(req.requestedDoc);
    Object.assign(req.requestedDoc, { ...todoPicker(req.body) });
    const newDoc = await req.requestedDoc.save({ _originalDoc });
    res.json(newDoc);
  }
);

router.delete(
  "/:id",
  validateMongoId.fromParams({ property: "id" }),
  authenticate,
  authorizeTodoOwner("params.id"),
  async (req, res, next) => {
    const todoData = deletedTodoPicker(req.body);
    const _originalDoc = originalTodoPicker(req.requestedDoc);
    Object.assign(req.requestedDoc, { ...todoData });
    const newDoc = await req.requestedDoc.save({ _originalDoc });
    res.json(newDoc);
  }
);

module.exports = router;
