// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: String,
  // Add any other fields you want to store for users
});

export default mongoose.models.User || mongoose.model('User', UserSchema);