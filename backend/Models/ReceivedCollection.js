import mongoose from "mongoose";
/**
 * Schema for Received Collection documents
 * This schema defines the structure for received collection data
 */
const ReceivedCollectionSchema = new mongoose.Schema({
  month: {
    type: String,
    required: [true, "Month is required"],
    trim: true,
    // Format: YYYY-MM (e.g., "2024-05" for May 2024)
    match: [/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format"],
    index: true // Add index for better query performance
  },
  process: {
    type: String,
    required: [true, "Process is required"],
    trim: true,
  },
  billAmount: {
    type: Number,
    required: [true, "Bill amount is required"],
    min: [0, "Bill amount cannot be negative"]
  },
  tds: {
    type: Number,
    required: [true, "TDS is required"],
    min: [0, "TDS cannot be negative"]
  },
  balance: {
    type: Number,
    required: [true, "Balance is required"],
    min: [0, "Balance cannot be negative"]
  },
  rate: {
    type: Number,
    required: [true, "Rate is required"],
    min: [0, "Rate cannot be negative"],
    max: [100, "Rate cannot exceed 100%"]
  },
  grossSalary: {
    type: Number,
    required: [true, "Gross salary is required"],
    min: [0, "Gross salary cannot be negative"]
  },
  netSalary: {
    type: Number,
    required: [true, "Net salary is required"],
    min: [0, "Net salary cannot be negative"]
  },
  total: {
    type: Number,
    required: [true, "Total is required"]
  },
  // Incentive distribution fields (60-40 split)
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Calculated incentive fields
  salaryPortionAmount: {
    type: Number,
    default: 0,
    min: [0, "Salary portion cannot be negative"]
  },
  supervisorIncentive: {
    type: Number,
    default: 0,
    min: [0, "Supervisor incentive cannot be negative"]
  },
  teamIncentivePool: {
    type: Number,
    default: 0,
    min: [0, "Team incentive pool cannot be negative"]
  },
  individualTeamIncentive: {
    type: Number,
    default: 0,
    min: [0, "Individual team incentive cannot be negative"]
  },
  status: {
    type: String,
    enum: ["pending", "processed", "completed"],
    default: "pending",
  }
}, {
  timestamps: true,
  // Compound index for better performance when querying by month and other fields
  index: { month: -1, createdAt: -1 }
});

// Add a virtual field to get formatted month display
ReceivedCollectionSchema.virtual('monthDisplay').get(function() {
  if (!this.month) return '';
  
  const [year, month] = this.month.split('-');
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const monthIndex = parseInt(month) - 1;
  return `${monthNames[monthIndex]} ${year}`;
});

// Virtual for calculating salary portion (Balance × Rate / 100)
ReceivedCollectionSchema.virtual('salaryPortion').get(function() {
  return (this.balance * this.rate) / 100;
});

// Virtual for profit margin calculation
ReceivedCollectionSchema.virtual('profitMargin').get(function() {
  const salaryPortion = (this.balance * this.rate) / 100;
  return salaryPortion - this.netSalary;
});

// Ensure virtual fields are serialized
ReceivedCollectionSchema.set('toJSON', {
  virtuals: true
});

// Pre-save middleware to validate month format and calculate fields
ReceivedCollectionSchema.pre('save', function(next) {
  // Validate month format
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
  
  // Auto-calculate balance if not provided or if billAmount/tds changed
  if (this.billAmount !== undefined && this.tds !== undefined) {
    this.balance = this.billAmount - this.tds;
  }
  
  // Auto-calculate total if required fields are present
  if (this.balance !== undefined && this.rate !== undefined && this.netSalary !== undefined) {
    const salaryPortion = (this.balance * this.rate) / 100;
    this.salaryPortionAmount = salaryPortion;
    this.total = salaryPortion - this.netSalary;

    // 🎯 Calculate 60-40 incentive distribution
    if (this.supervisor && this.teamMembers && this.teamMembers.length > 0) {
      this.supervisorIncentive = salaryPortion * 0.60; // 60% to supervisor
      this.teamIncentivePool = salaryPortion * 0.40;   // 40% to team
      this.individualTeamIncentive = this.teamIncentivePool / this.teamMembers.length;
    } else {
      // No distribution if supervisor/team not assigned
      this.supervisorIncentive = 0;
      this.teamIncentivePool = 0;
      this.individualTeamIncentive = 0;
    }
  }

  next();
});

// Pre-update middleware for findOneAndUpdate operations
ReceivedCollectionSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  
  // Auto-calculate balance if billAmount or tds is being updated
  if (update.billAmount !== undefined || update.tds !== undefined) {
    const billAmount = update.billAmount || 0;
    const tds = update.tds || 0;
    update.balance = billAmount - tds;
  }
  
  // Auto-calculate total if relevant fields are being updated
  if (update.balance !== undefined || update.rate !== undefined || update.netSalary !== undefined) {
    const balance = update.balance || 0;
    const rate = update.rate || 0;
    const netSalary = update.netSalary || 0;
    const salaryPortion = (balance * rate) / 100;
    update.salaryPortionAmount = salaryPortion;
    update.total = salaryPortion - netSalary;

    // 🎯 Calculate 60-40 distribution for updates
    if (update.supervisor && update.teamMembers && update.teamMembers.length > 0) {
      update.supervisorIncentive = salaryPortion * 0.60;
      update.teamIncentivePool = salaryPortion * 0.40;
      update.individualTeamIncentive = update.teamIncentivePool / update.teamMembers.length;
    } else {
      update.supervisorIncentive = 0;
      update.teamIncentivePool = 0;
      update.individualTeamIncentive = 0;
    }
  }

  next();
});

// Static method to get collections by month range
ReceivedCollectionSchema.statics.findByMonthRange = function(startMonth, endMonth) {
  return this.find({
    month: {
      $gte: startMonth,
      $lte: endMonth
    }
  }).sort({ month: -1, createdAt: -1 });
};

// Static method to get current month collections
ReceivedCollectionSchema.statics.findCurrentMonth = function() {
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7); // YYYY-MM format
  return this.find({ month: currentMonth }).sort({ createdAt: -1 });
};

// Static method to get monthly statistics
ReceivedCollectionSchema.statics.getMonthlyStats = function(month) {
  return this.aggregate([
    { $match: { month: month } },
    {
      $group: {
        _id: null,
        totalEntries: { $sum: 1 },
        totalBillAmount: { $sum: "$billAmount" },
        totalTDS: { $sum: "$tds" },
        totalBalance: { $sum: "$balance" },
        totalGrossSalary: { $sum: "$grossSalary" },
        totalNetSalary: { $sum: "$netSalary" },
        totalAmount: { $sum: "$total" },
        avgRate: { $avg: "$rate" }
      }
    }
  ]);
};

// Instance method to check if collection is for current month
ReceivedCollectionSchema.methods.isCurrentMonth = function() {
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7); // YYYY-MM format
  return this.month === currentMonth;
};

// Instance method to recalculate totals
ReceivedCollectionSchema.methods.recalculateTotals = function() {
  this.balance = this.billAmount - this.tds;
  const salaryPortion = (this.balance * this.rate) / 100;
  this.total = salaryPortion - this.netSalary;
  return this;
};

// Create compound indexes for better query performance
ReceivedCollectionSchema.index({ month: -1, process: 1 });
ReceivedCollectionSchema.index({ month: -1, createdAt: -1 });
ReceivedCollectionSchema.index({ process: 1, month: -1 });

const ReceivedCollection = mongoose.model('ReceivedCollection', ReceivedCollectionSchema);

export default ReceivedCollection