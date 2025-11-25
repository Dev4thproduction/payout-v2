const mongoose = require('mongoose');

const CaseEntrySchema = new mongoose.Schema({
  numberOfCases: {
    type: Number,
    required: true,
    min: 1
  },
  verification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Verification',
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CaseEntry', CaseEntrySchema);
