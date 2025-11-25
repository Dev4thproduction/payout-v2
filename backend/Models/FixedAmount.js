import mongoose from "mongoose";

const fixedAmountSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0, "Amount must be non-negative"],
    validate: {
      validator: function(value) {
        return !isNaN(value) && isFinite(value);
      },
      message: "Amount must be a valid number"
    }
  },
  description: {
    type: String,
    trim: true,
    maxLength: [200, "Description cannot exceed 200 characters"],
    default: ""
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: String,
    trim: true,
    default: "system"
  }
}, {
  timestamps: true, // This will automatically manage createdAt and updatedAt
  versionKey: false // Remove __v field
});

// Pre-save middleware to update the updatedAt field
fixedAmountSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

// Instance method to format amount
fixedAmountSchema.methods.getFormattedAmount = function() {
  return this.amount.toFixed(2);
};

// Static method to get the current active fixed amount
fixedAmountSchema.statics.getCurrentAmount = async function() {
  return await this.findOne({ isActive: true }).sort({ updatedAt: -1 });
};

// Static method to set new amount and deactivate old ones
fixedAmountSchema.statics.setNewAmount = async function(amount, description = "", updatedBy = "system") {
  // Deactivate all existing amounts
  await this.updateMany({}, { isActive: false });
  
  // Create new active amount
  const newAmount = new this({
    amount,
    description,
    updatedBy,
    isActive: true
  });
  
  return await newAmount.save();
};

// Index for better query performance
fixedAmountSchema.index({ isActive: 1, updatedAt: -1 });

const FixedAmount = mongoose.model("FixedAmount", fixedAmountSchema);

export default FixedAmount