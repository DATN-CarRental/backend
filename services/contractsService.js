import Booking from '../models/bookings.js'
import Contract from '../models/contracts.js'
import Car from '../models/cars.js'
import Model from '../models/models.js'
import User from '../models/users.js'

export const createContract = async (createBy, bookingId, payload) => {
  try {
    // Tạo hợp đồng mới và lưu vào cơ sở dữ liệu
    const newContract = new Contract({
      createBy: createBy,
      bookingId: bookingId,
      ...payload
    })
    const savedContract = await newContract.save()

    // Cập nhật trường 'contract' trong bản ghi booking tương ứng
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { contract: savedContract._id, status: 'Đã có hợp đồng' },
      { new: true } // Để nhận kết quả cập nhật mới
    )

    return savedContract, booking // Trả về hợp đồng vừa tạo
  } catch (error) {
    throw new Error(error)
  }
}

export const getContractById = async (createBy) => {
  try {
    const getContract = await Contract.find({ createBy: createBy })
      .populate('createBy')
      .populate({
        path: 'bookingId',
        populate: {
          path: 'bookBy',
          model: 'Users'
        }
      })
      .populate({
        path: 'bookingId',
        populate: {
          path: 'carId',
          model: 'Cars',
          populate: [
            {
              path: 'model',
              model: 'Models'
            },
            { path: 'brand', model: 'Brands' }
          ]
        }
      })
      .sort({ status: 1 })

    return getContract
  } catch (error) {
    throw error
  }
}

export const getListContract = async () => {
  try {
    const getListBooking = await Contract.find({})
      .populate({ path: 'createBy', model: 'Users' })
      .populate({
        path: 'bookingId',
        populate: {
          path: 'bookBy',
          model: 'Users'
        }
      })
      .populate({
        path: 'bookingId',
        populate: {
          path: 'carId',
          model: 'Cars',
          populate: [
            {
              path: 'model',
              model: 'Models'
            },
            { path: 'brand', model: 'Brands' }
          ]
        }
      })
      .sort({ status: 1 })

    return getListBooking
  } catch (error) {
    throw error
  }
}
