const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 12 },
  timestamp: { type: Date, required: true },
  text: { type: String, required: true, maxlength: 100 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

// Virtual for message url
MessageSchema.virtual("url").get(function () {
  return `/message/${this._id}`;
});

// Virtual for Short Date
MessageSchema.virtual("shortDate").get(function () {
  return `${this.timestamp.getHours()}:${this.timestamp.getMinutes()} ${this.timestamp.getDate()}/${this.timestamp.getMonth() + 1}/${this.timestamp.getFullYear()}`;
});
module.exports = mongoose.model("Message", MessageSchema);
