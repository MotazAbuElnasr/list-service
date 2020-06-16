const mongoose = require("mongoose");
const {
  state: { TODO, IN_PROGRESS, DONE },
} = require("../constants/todoConstants");
const { Schema } = mongoose;
const assigneeSchema = {
  type: mongoose.ObjectId,
  ref: "User",
};

const stateSchema = {
  type: String,
  default: TODO,
  validate: {
    validator: (v) => [TODO, IN_PROGRESS, DONE].includes(v),
    message: "INVALID_STATE",
  },
};
const todoSchema = {
  title: { type: String, required: true },
  description: { type: String, required: true },
  state: stateSchema,
  assignee: assigneeSchema,
  dueDate: { type: Date },
  deleted: { type: Boolean, default: false },
};

const historySchema = new Schema(
  {
    ...todoSchema,
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);
const todoSchemaWithHistory = new Schema({
  ...todoSchema,
  history: { type: [historySchema], default: [] },
});

todoSchemaWithHistory.pre("save", function (next, { _originalDoc }) {
  this._doc.state = this.isNew ? TODO : this._doc.state;
  if (_originalDoc) this._doc.history.push(_originalDoc);
  next();
});
const Todo = mongoose.model("Todo", todoSchemaWithHistory);

module.exports = Todo;
