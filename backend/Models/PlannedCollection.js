import mongoose from "mongoose";
/**
 * Schema for Planned Collection documents
 * This schema defines the structure for planned collection data
 */
const plannedCollectionSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: [true, "Month is required"],
      trim: true,
      // Format: YYYY-MM (e.g., "2024-05" for May 2024)
      match: [/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format"],
      index: true // Add index for better query performance
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    product: {
      type: String,
      required: [true, "Product is required"],
      trim: true,
    },
    numCases: {
      type: Number,
      default: 0,
      min: [0, "Number of cases cannot be negative"]
    },
    pos: {
      type: Number,
      default: 0,
      min: [0, "POS cannot be negative"]
    },
    basic: {
      type: Number,
      default: 0,
      min: [0, "Basic salary cannot be negative"]
    },
    moneyCollection: {
      type: Number,
      default: 0,
      min: [0, "Money collection cannot be negative"]
    },
    status: {
      type: String,
      enum: ["pending", "processed", "completed"],
      default: "pending",
    }
  },
  { 
    timestamps: true,
    // Compound index for better performance when querying by month and other fields
    index: { month: -1, createdAt: -1 }
  }
);

// Add a virtual field to get formatted month display
plannedCollectionSchema.virtual('monthDisplay').get(function() {
  if (!this.month) return '';
  
  const [year, month] = this.month.split('-');
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const monthIndex = parseInt(month) - 1;
  return `${monthNames[monthIndex]} ${year}`;
});

// Ensure virtual fields are serialized
plannedCollectionSchema.set('toJSON', {
  virtuals: true
});

// Pre-save middleware to validate month format
plannedCollectionSchema.pre('save', function(next) {
  if (this.month) {
    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(this.month)) {
      return next(new Error('Month must be in YYYY-MM format'));
    }
    
    const [year, month] = this.month.split('-');
    const monthNum = parseInt(month);
    
    if (monthNum < 1 || monthNum > 12) {
      return next(new Error('Month must be between 01 and 12'));
    }
    
    const yearNum = parseInt(year);
    if (yearNum < 2020 || yearNum > 2030) { // Reasonable year range
      return next(new Error('Year must be between 2020 and 2030'));
    }
  }
  next();
});

// Static method to get collections by month range
plannedCollectionSchema.statics.findByMonthRange = function(startMonth, endMonth) {
  return this.find({
    month: {
      $gte: startMonth,
      $lte: endMonth
    }
  }).sort({ month: -1, createdAt: -1 });
};

// Static method to get current month collections
plannedCollectionSchema.statics.findCurrentMonth = function() {
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7); // YYYY-MM format
  return this.find({ month: currentMonth }).sort({ createdAt: -1 });
};

// Instance method to check if collection is for current month
plannedCollectionSchema.methods.isCurrentMonth = function() {
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7); // YYYY-MM format
  return this.month === currentMonth;
};

// Create the model
const PlannedCollection = mongoose.model("PlannedCollection", plannedCollectionSchema);

export default PlannedCollection;