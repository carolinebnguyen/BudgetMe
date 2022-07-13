import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  username: {
    required: true,
    unique: true,
    lowercase: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
});

const User = mongoose.model('User', userSchema);

export default User;
