import mongoose from 'mongoose'
import moment from 'moment-timezone'
import { ref } from 'yup'

const bookingsSchema = new mongoose.Schema(
  {
    bookBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    carId: {
      type: mongoose.Types.ObjectId,
      ref: 'Cars'
    },
    timeBookingStart: {
      type: Date, 
      require: true,
      get: (v) => moment(v).format('YYYY-MM-DD HH:mm'),
      set: (v) => moment(v, 'YYYY-MM-DD HH:mm').toDate()
    },
    timeBookingEnd: {
      type: Date,
      require: true,
      get: (v) => moment(v).format('YYYY-MM-DD HH:mm'),
      set: (v) => moment(v, 'YYYY-MM-DD HH:mm').toDate()
    },
    fullname: {
      type: String
    },
    phone: {
      type: String,
      require: true
    },
    address: {
      type: String,
      require: true
    },
    totalCost: {
      type: Number,
      require: true
    },
    codeTransaction: {
      type: String,
      require: true
    },
    timeTransaction: {
      type: String,
      require: true
    },
    status: {
      type: String,
      enum: ['processing', 'completed', 'canceled'],
      default: 'processing'
    },
    contract: {
      type: mongoose.Types.ObjectId,
      ref: 'Contracts'
    },
    couponId: {
      type: mongoose.Types.ObjectId,
      ref: 'Coupons'
    }
  },
  { timestamps: true }
)

const Booking = mongoose.model('Bookings', bookingsSchema)

export default Booking
