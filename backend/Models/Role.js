import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  tasksView: {
    type: Boolean,
    default: false,
  },
  tasksDetailsView: {
    type: Boolean,
    default: false,
  },
  tasksUpdate: {
    type: Boolean,
    default: false,
  },
  tasksAddCustomer: {
    type: Boolean,
    default: false,
  },
  tasksAddAllocation: {
    type: Boolean,
    default: false,
  },
  allocationPendingTasks: {
    type: Boolean,
    default: false,
  },
  visitPendingTasks: {
    type: Boolean,
    default: false,
  },
  inProgressTasks: {
    type: Boolean,
    default: false,
  },
  finalisationPendingTasks: {
    type: Boolean,
    default: false,
  },
  completedTasks: {
    type: Boolean,
    default: false,
  },
  waivedTasks: {
    type: Boolean,
    default: false,
  },
  calling: {
    type: Boolean,
    default: false,
  },
  taskSummary: {
    type: Boolean,
    default: false,
  },
  transfers: {
    type: Boolean,
    default: false,
  },
  usersView: {
    type: Boolean,
    default: false,
  },
  usersAdd: {
    type: Boolean,
    default: false,
  },
  usersUpdate: {
    type: Boolean,
    default: false,
  },
  viewAttendance: {
    type: Boolean,
    default: false
  },
  rejoinUsers: {
    type: Boolean,
    default: false,
  },
  viewUnassignTasks: {
    type: Boolean,
    default: false
  },
  viewTransfferedTasks: {
    type: Boolean,
    default: false,
  },
  viewFieldTasks: {
    type: Boolean,
    default: false
  },
  resignedUsers: {
    type: Boolean,
    default: false,
  },
  rolesView: {
    type: Boolean,
    default: false,
  },
  rolesAdd: {
    type: Boolean,
    default: false,
  },
  rolesUpdate: {
    type: Boolean,
    default: false,
  },
  customersView: {
    type: Boolean,
    default: false,
  },
  customersAdd: {
    type: Boolean,
    default: false,
  },
  customersUpdate: {
    type: Boolean,
    default: false,
  },
  appAccess: {
    type: Boolean,
    default: false,
  },
  webAccess: {
    type: Boolean,
    default: false,
  },
  settings: {
    type: Boolean,
    default: false,
  },
  reports: {
    type: Boolean,
    default: false,
  },
  pincodes: {
    type: Boolean,
    default: false,
  },
  dashboard: {
    type: Boolean,
    default: false,
  },
  processView: {
    type: Boolean,
    default: false,
  },
  processAdd: {
    type: Boolean,
    default: false,
  },
  ProcessUpdate: {
    type: Boolean,
    default: false,
  },
  ProcessDelete: {
    type: Boolean,
    default: false,
  },
  assignProcessView: {
    type: Boolean,
    default: false,
  },
  assignProcessAdd: {
    type: Boolean,
    default: false,
  },
  assignProcessUpdate: {
    type: Boolean,
    default: false,
  },
  assignProcessDelete: {
    type: Boolean,
    default: false,
  },
  DailyCollectionView: {
    type: Boolean,
    default: false,
  },
  DailyCollectionViewAdd: {
    type: Boolean,
    default: false,
  },
  DailyCollectionViewUpdate: {
    type: Boolean,
    default: false,
  },
  DailyCollectionViewDelete: {
    type: Boolean,
    default: false,
  },
  mis: {
    type: Boolean,
    default: false,
  },
  driveNbfcDelhi: {
    type: Boolean,
    default: false,
  },
  driveNbfcHaryana: {
    type: Boolean,
    default: false,
  },
  driveNbfcUp: {
    type: Boolean,
    default: false,
  },
  driveNbfcTata: {
    type: Boolean,
    default: false,
  },
  driveHdfcCard: {
    type: Boolean,
    default: false,
  },
  driveHdfcRetail: {
    type: Boolean,
    default: false,
  },
  driveIdfc: {
    type: Boolean,
    default: false,
  },
  driveKotak: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Role = mongoose.model('Role', roleSchema);

export default Role;
