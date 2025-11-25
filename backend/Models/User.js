import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  identifier: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  },
  customers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  }],
  joinedOn: {
    type: String,
    default: Date.now,
  },
  // * Mobile device
  deviceID: {
    type: String,
    default: '',
  },
  deviceInfo: {
    type: Object,
    default: {},
  },
  ipAddress: {
    type: String,
    default: '0.0.0.0',
  },
  distanceForCalling: {
    type: Number,
    required: false,
  },
  lastLogin: {
    type: String,
    default: '',
  },
  calling: {
    type: Boolean,
    default: false,
  },
  attendanceStatus: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Boolean,
    default: true,
  },
  resignedOn: {
    type: String,
    default: '',
  },
  fcmToken: {
    type: String,
    default: '',
  },
  tokenVersion: {
    type: Number,
    default: 0,
  },
  blacklistedTokens: [{
    token: String,
    blacklistedAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastForceLogout: {
    type: Date,
    default: null,
  }
});

const User = mongoose.model('User', userSchema);

export default User;
