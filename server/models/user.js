import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  phone: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
