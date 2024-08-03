import mongoose from 'mongoose';

const { Schema } = mongoose;

interface IUser {
  name: string;
  about: string;
  avatar: string;
}
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    required: true,
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 200,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IUser>('user', userSchema);
