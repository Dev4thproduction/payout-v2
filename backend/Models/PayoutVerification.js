import mongoose from "mongoose";
const PayoutVerificationSchema = new mongoose.Schema({
  verification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Verification', // Refers to the Price Verification model
    required: true
  },
  numCases: {
    type: Number,
    required: true,
    min: [1, 'Number of cases must be at least 1']
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  month: {
    type: String,
    required: true,
    match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PayoutVerification = mongoose.model('PayoutVerification', PayoutVerificationSchema);

export default PayoutVerification;