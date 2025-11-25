import mongoose from "mongoose";

const VerificationSchema = new mongoose.Schema({
  process: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Process',
    required: true
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Verification = mongoose.model('Verification', VerificationSchema);

export default Verification;