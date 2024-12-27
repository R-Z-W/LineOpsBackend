const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid');

const UserSchema = new mongoose.Schema({
  userId: { // UUID support for user ID security
    type: String, 
    default: () => uuidv4(),
    unique: true,
    required: true 
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  hireDate: { type: Date, required: true },
  salary: { type: Number, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  employmentStatus: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean, default: false }
});

// Hash the password before saving it
// .methods is allows for operations on individual documents
UserSchema.methods.hashPassword = function () {
    this.password = bcrypt.hashSync(this.password, 10); // Salt the hash
  };
  
  // Compare entered password with the stored hashed password
  UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password); 
  };
  
  // Hash the password if it's being created or modified
  UserSchema.pre("save", function (next) {
    if (this.isModified("password")) {
      this.hashPassword();
    }
    next();
  });

const User = mongoose.model("User", UserSchema);
module.exports = { User };