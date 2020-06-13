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

const historySchema = new Schema(
  {
    state: stateSchema,
    assignee: assigneeSchema,
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);
const todoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  state: stateSchema,
  assignee: assigneeSchema,
  dueDate: { type: Date },
  deleted: { type: Boolean, default: false },
  history: { type: [historySchema], default: [] },
});

const Todo = mongoose.model("Todo", todoSchema);
todoSchema.pre("save", function (next) {
  const { state, assignee } = this._doc;
  this._doc.history.push({ state, assignee });
  next();
});

module.exports = Todo;
