import bcrypt from 'bcryptjs';
import { Schema, model, models } from 'mongoose';

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      minLength: 3,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'please enter a valid email',
      ],
    },
    password: { type: String, minLength: 3, required: true },
    image: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    isSubscribe: {
      type: Boolean,
      required: false,
    },
    role: {
      type: String,
      required: false,
      default: 'admin',
    },
  },
  {
    timestamps: true,
    strict: 'throw',
  },
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  if (!this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = models.User || model('User', userSchema);
export default User;
