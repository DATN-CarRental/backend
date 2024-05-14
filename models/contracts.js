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
      enum: ['Đang thực hiện', 'Đã tất toán', 'Đã Hủy'],
      default: 'Đang thực hiện'
    }
  },
  { timestamps: true }
)
const Contract = mongoose.model('Contracts', contractsSchema)
export default Contract
