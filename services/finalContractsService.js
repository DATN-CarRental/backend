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

      await Contract.findByIdAndUpdate(contractId, { $set: { status: 'Đã tất toán' } }, { new: true })

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

      await Contract.findByIdAndUpdate(contractId, { $set: { status: 'Đã tất toán' } }, { new: true })

      return [finalContractResult, getFinalContract]
    }
  } catch (error) {
    throw new Error(error)
  }
}

export const getFinalContractByUserId = async (createBy) => {
  try {
    const listFinalContracts = await FinalContract.find({})
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

    return listFinalContracts
  } catch (error) {
    throw error
  }
}

export const getFinalContractById = async (contractId) => {
  try {
    const finalContract = await FinalContract.find({
      contractId: contractId.toString()
    })
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
        populate: [
          {
            path: 'bookBy',
            model: 'Users'
          },
          {
            path: 'carId',
            model: 'Cars'
          }
        ]
      }
    })

    return finalContract
  } catch (error) {
    throw error
  }
}

export const getListFinalContracts = async () => {
  try {
    const finalContracts = await FinalContract.find({})
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

    return finalContracts
  } catch (error) {
    throw error
  }
}
