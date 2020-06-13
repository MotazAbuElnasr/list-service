const mongoose = require("mongoose");
const {
  state: { TODO, IN_PROGRESS, DONE },
} = require("../constants/todoConstants");
const { Schema } = mongoose;
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
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const todoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  user: {
    type: mongoose.ObjectId,
    ref: "User",
  },
  state: stateSchema,
  dueDate: { type: Date },
  history: { type: [historySchema], default: [] },
  deleted: { type: Boolean, default: false },
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
