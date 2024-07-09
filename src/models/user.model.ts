import mongoose, { Document, Schema } from 'mongoose';

interface Iprofile {
  address: string;
  phone: string;
}

interface Iuser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  profile?: Iprofile;
}

const profileSchema: Schema = new Schema({
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
});

export const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'seller', 'admin'],
      default: 'user',
    },
    profile: {
      type: profileSchema,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<Iuser>('User', userSchema);
