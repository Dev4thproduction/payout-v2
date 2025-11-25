import mongoose from 'mongoose'

const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    logo: {
      type: String,
      default: 'MSER Ventures Private Limited', // Management Services or MSER Ventures Private Limited
    },
    mapOnPDF: {
      type: Boolean,
      default: false,
    },
    openTransfers: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const Customer = mongoose.model('Customer', CustomerSchema)

export default Customer