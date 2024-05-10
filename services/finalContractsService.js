import Booking from '../models/bookings.js'
import Contract from '../models/contracts.js'
import FinalContract from '../models/finalContracts.js'
import BookedTimeSlot from '../models/bookedTimeSlots.js'
import moment from 'moment-timezone'

export const createFinalContract = async (contractId, payload) => {
  try {
    // Parse the input date using the 'DD-MM-YYYY' format and set the timezone to Asia/Ho_Chi_Minh (ICT)
    var formattedTimeFinish
    var newFinalContract

    if (payload.timeFinish !== undefined) {
      formattedTimeFinish = moment.tz(payload?.timeFinish.concat(' 5:30'), 'YYYY-MM-DD HH:mm').toDate()
      newFinalContract = new FinalContract({
        contractId: contractId,
        timeFinish: formattedTimeFinish,
        ...payload
      })

      const finalContractResult = await newFinalContract.save()
      const getFinalContract = await FinalContract.find({ _id: finalContractResult._id })
        .populate({
          path: 'contractId',
          populate: {
            path: 'createBy',
            model: 'Users'
          }
        })
        .populate({
          path: 'contractId',
          populate: {
            path: 'bookingId',
            model: 'Bookings',
            populate: {
              path: 'bookBy',
              model: 'Users'
            }
          }
        })

      await BookedTimeSlot.findOneAndUpdate(
        { bookingId: getFinalContract[0].contractId.bookingId._id },
        { $set: { to: formattedTimeFinish } },
        { new: true }
      )

      await Contract.findByIdAndUpdate(contractId, { $set: { status: 'completed' } }, { new: true })

      return [finalContractResult, getFinalContract]
    } else {
      newFinalContract = new FinalContract({
        contractId: contractId,
        ...payload
      })

      const finalContractResult = await newFinalContract.save()
      const getFinalContract = await FinalContract.find({ _id: finalContractResult._id })
        .populate({
          path: 'contractId',
          populate: {
            path: 'createBy',
            model: 'Users'
          }
        })
        .populate({
          path: 'contractId',
          populate: {
            path: 'bookingId',
            model: 'Bookings',
            populate: {
              path: 'bookBy',
              model: 'Users'
            }
          }
        })

      await Contract.findByIdAndUpdate(contractId, { $set: { status: 'completed' } }, { new: true })

      return [finalContractResult, getFinalContract]
    }
  } catch (error) {
    throw new Error(error)
  }
}

export const getFinalContractById = async (createBy) => {
  try {
    console.log('CREATED_BY', createBy.toString())
    const getListBooking = await FinalContract.find({})
      .populate({
        path: 'contractId',
        populate: {
          path: 'createBy',
          match: { _id: createBy.toString() },
          model: 'Users'
        }
      })
      .populate({
        path: 'contractId',
        populate: {
          path: 'bookingId',
          model: 'Bookings',
          populate: {
            path: 'bookBy',
            model: 'Users'
          }
        }
      })

    return getListBooking
  } catch (error) {
    throw error
  }
}

export const getListFinalContracts = async () => {
  try {
    const getListBooking = await FinalContract.find({})
      .populate({
        path: 'contractId',
        populate: {
          path: 'createBy',
          model: 'Users'
        }
      })
      .populate({
        path: 'contractId',
        populate: {
          path: 'bookingId',
          model: 'Bookings',
          populate: {
            path: 'bookBy',
            model: 'Users'
          }
        }
      })

    return getListBooking
  } catch (error) {
    throw error
  }
}
