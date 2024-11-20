const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  bio: { type: String, default: '' }, // Optional bio field
  userProfile: { type: String, default: '' }, // Optional profile picture URL or image
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }], // Reference to questions
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }], // Reference to answers
}, { timestamps: true });

// Password hashing middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password comparison method
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
