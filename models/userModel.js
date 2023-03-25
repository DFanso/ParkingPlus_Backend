const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true},
  password: { type: String, required: true },
  email: {type: String, required: true},
  plate: {type: String, required: true},
  phone: {type: String, required: true},
  cash: {type: String},
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log("Enter",enteredPassword,"This",this.password)
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});



const User = mongoose.model("User", userSchema);

module.exports = User;
