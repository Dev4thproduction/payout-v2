import mongoose from "mongoose";

const DistributionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  product: {
    type: String,
    required: true
  },
  month: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Validate month format (YYYY-MM)
        return /^\d{4}-\d{2}$/.test(v);
      },
      message: 'Month must be in YYYY-MM format'
    }
  },
  cases: {
    type: Number,
    default: 0
  },
  pos: {
    type: Number,
    required: true
  },
  basic: {
    type: Number,
    required: true
  },
  moneyCollection: {
    type: Number,
    default: 0
  },
  incentiveReceived: {
    type: Number,
    required: true
  },
  // Supervisor and Team for 60-40 distribution
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Calculated incentive fields (60-40 split)
  supervisorIncentive: {
    type: Number,
    default: 0
  },
  teamIncentivePool: {
    type: Number,
    default: 0
  },
  individualTeamIncentive: {
    type: Number,
    default: 0
  },
  employeeIncentive: {
    type: Number,
    required: true
  },
  // Reference to planned collection (optional)
  plannedCollectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlannedCollection',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to calculate 60-40 incentive distribution
DistributionSchema.pre('save', function(next) {
  // Calculate 60-40 split from incentiveReceived
  if (this.incentiveReceived && this.supervisor && this.teamMembers && this.teamMembers.length > 0) {
    this.supervisorIncentive = this.incentiveReceived * 0.60; // 60% to supervisor
    this.teamIncentivePool = this.incentiveReceived * 0.40;   // 40% to team
    this.individualTeamIncentive = this.teamIncentivePool / this.teamMembers.length;
  } else {
    this.supervisorIncentive = 0;
    this.teamIncentivePool = 0;
    this.individualTeamIncentive = 0;
  }
  next();
});

// Pre-update middleware for findOneAndUpdate operations
DistributionSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();

  if (update.incentiveReceived && update.supervisor && update.teamMembers && update.teamMembers.length > 0) {
    update.supervisorIncentive = update.incentiveReceived * 0.60;
    update.teamIncentivePool = update.incentiveReceived * 0.40;
    update.individualTeamIncentive = update.teamIncentivePool / update.teamMembers.length;
  } else if (update.incentiveReceived !== undefined) {
    update.supervisorIncentive = 0;
    update.teamIncentivePool = 0;
    update.individualTeamIncentive = 0;
  }

  next();
});

// Add compound index for efficient querying
DistributionSchema.index({ name: 1, product: 1, month: 1 });

const Distribution = mongoose.model('Distribution', DistributionSchema);

export default Distribution