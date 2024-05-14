import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    fullname: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'staff'],
      default: 'user'
    },
    gender: {
      type: String
    },
    dateOfBirth: {
      type: String
    },
    driverLicenses: {
      type: mongoose.Types.ObjectId,
      ref: 'DriverLicenses'
    },
    profilePicture: {
      type: String
    },
    address: {
      type: String
    },
    status: {
      type: String, 
      enum: ['Hoạt động', 'Không hoạt động'],
      default: 'Hoạt động'
    },
    isConfirmed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

const User = mongoose.model('Users', userSchema)

export default User
