import mongoose from "mongoose";

const ProcessSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Client',
    ref: 'Client',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Product',
    ref: 'Product',
    required: true,
  },
  rate: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Process = mongoose.model('Process', ProcessSchema);

export default Process;