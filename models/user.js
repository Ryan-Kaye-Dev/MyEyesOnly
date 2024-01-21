const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  membershipStatus: {
    type: String,
    required: true,
    enum: ["Standard", "Club", "Admin"],
    default: "Standard",
  },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

// Virtual for user's full name
UserSchema.virtual("name").get(function () {
  return this.firstName + " " + this.lastName;
});

module.exports = mongoose.model("User", UserSchema);
