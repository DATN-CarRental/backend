import mongoose from 'mongoose'
const contractsSchema = new mongoose.Schema(
  {
    createBy: { type: mongoose.Types.ObjectId, ref: 'Users' },
    bookingId: { type: mongoose.Types.ObjectId, ref: 'Bookings' },
    images: {
      type: Array
    },
    status: {
      type: String,
      enum: ['processing', 'completed', 'cancel'],
      default: 'processing'
    }
  },
  { timestamps: true }
)
const Contract = mongoose.model('Contracts', contractsSchema)
export default Contract
