import mongoose from "mongoose";
const AttendanceSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
    // Format: "YYYY-MM" (e.g., "2024-03")
  },
  name: {
    type: String,
    required: true,
  },
  identifier: {
    type: String,
    required: true,
    // Note: Removed unique constraint since same employee can have multiple months
  },
  workingDays: {
    type: Number,
    default: 0,
  },
  leave: {
    type: Number,
    default: 0,
  },
  unpaidLeave: {
    type: Number,
    default: 0,
  },
  fixedSalary: {
    type: Number,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

// Compound index for month and identifier to ensure uniqueness per month
AttendanceSchema.index({ month: 1, identifier: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', AttendanceSchema);

export default Attendance;