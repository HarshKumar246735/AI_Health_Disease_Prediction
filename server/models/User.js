const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 120 },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    isDemo: { type: Boolean, default: false }, // marks rows created by `npm run seed:demo`
  },
  { timestamps: true }
);

userSchema.index({ createdAt: -1 });
userSchema.index({ role: 1 });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.methods.toPublic = function toPublic() {
  return { id: this._id, name: this.name, email: this.email, role: this.role, createdAt: this.createdAt };
};

module.exports = mongoose.model('User', userSchema);
