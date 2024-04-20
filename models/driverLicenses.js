 import mongoose from 'mongoose'

const driverLicensesSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true
    },
    drivingLicenseNo: {
      type: Number,
      required: true
    },
    klass: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['confirmed', 'unconfirmed'],
      default: 'unconfirmed'
    }
  },
  { timestamps: true }
)

const DriverLicense = mongoose.model('DriverLicenses', driverLicensesSchema)

export default DriverLicense
