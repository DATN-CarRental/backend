import Booking from '../models/bookings.js'
import BookedTimeSlot from '../models/bookedTimeSlots.js'
import moment from 'moment-timezone'
import mongoose from 'mongoose'
import { config } from 'dotenv'
export const createBooking = async (user_id, carId, payload) => {
  try {
    const { timeBookingStart, timeBookingEnd } = payload

    console.log(timeBookingStart, timeBookingEnd)
    console.log(payload)
    const bookingStart = moment.utc(timeBookingStart).toDate()
    const bookingEnd = moment.utc(timeBookingEnd).toDate()
    console.log(bookingStart, bookingEnd)

    const newBooking = new Booking({
      bookBy: user_id,
      carId: carId,
      timeBookingStart: bookingStart,
      timeBookingEnd: bookingEnd,
      ...payload
    })

    const bookingResult = await newBooking.save()

    const newBookedTimeSlot = await BookedTimeSlot.findOneAndUpdate(
      {
        carId: carId,
        from: moment.utc(bookingResult.timeBookingStart).toDate(),
        to: moment.utc(bookingResult.timeBookingEnd).toDate()
      },
      {
        bookingId: bookingResult._id,
        from: bookingStart,
        to: bookingEnd
      },
      { new: true }
    )

    return { bookingResult, newBookedTimeSlot }
  } catch (error) {
    throw error
  }
}

export const cancelBookedTimeSlots = async (carId, payload) => {
  try {
    const { timeBookingStart, timeBookingEnd } = payload

    console.log(timeBookingStart, timeBookingEnd)
    console.log(payload)
    const bookingStart = moment.utc(timeBookingStart).toDate()
    const bookingEnd = moment.utc(timeBookingEnd).toDate()
    console.log(bookingStart, bookingEnd)

    const deleteBookedTimeSlot = await BookedTimeSlot.findOneAndDelete({
      carId: carId,
      from: bookingStart,
      to: bookingEnd
    })

    return { deleteBookedTimeSlot }
  } catch (error) {
    throw error
  }
}

export const bookRecord = async (carId, payload) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { timeBookingStart, timeBookingEnd } = payload

    console.log(timeBookingStart, timeBookingEnd)
    console.log(payload)
    const startTime = moment.utc(timeBookingStart).toDate()
    const endTime = moment.utc(timeBookingEnd).toDate()
    const existingBookedTimeSlots = await BookedTimeSlot.findOne({
      carId: carId,
      $or: [
        { $and: [{ from: { $gte: startTime } }, { from: { $lt: endTime } }] },
        { $and: [{ to: { $gt: startTime } }, { to: { $lte: endTime } }] }
      ]
    }).session(session)

    if (existingBookedTimeSlots) {
      // Resource is already booked, handle accordingly
      throw new Error('Record already booked')
    }

    // Create a new booking
    const newBookedTimeSlots = new BookedTimeSlot({ from: startTime, to: endTime, carId: carId })
    await newBookedTimeSlots.save({ session })

    await session.commitTransaction()
    session.endSession()
    console.log('Booking successful')
    return newBookedTimeSlots
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
    console.error('Booking failed:', error.message)
  }
}

export const cancelBooking = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId)

    if (!booking) {
      return null
    }

    const updateBooking = await Booking.findByIdAndUpdate(bookingId, { status: 'Đã hủy' }, { new: true })

    if (!updateBooking) {
      return null
    }
    await BookedTimeSlot.deleteMany({ bookingId: bookingId })
    return updateBooking
  } catch (error) {
    throw error
  }
}

export const getHistoryBooking = async (bookBy) => {
  try {
    const getHistoryBooking = await Booking.find({ bookBy: bookBy })
      .populate({
        path: 'carId',
        populate: {
          path: 'brand',
          model: 'Brands'
        }
      })
      .populate({
        path: 'carId',
        populate: {
          path: 'model',
          model: 'Models'
        }
      })
      .populate('contract')
      .sort({ status: 1 })
    return getHistoryBooking
  } catch (error) {
    throw error
  }
}

export const getListBooking = async () => {
  try {
    const getListBooking = await Booking.find({})
      .populate('bookBy', 'fullname')
      .populate({
        path: 'carId',
        populate: [
          {
            path: 'model',
            model: 'Models'
          },
          { path: 'brand', model: 'Brands' }
        ]
      })
      .populate('contract')
      .sort({ status: 1, timeBookingStart: 1 })
    return getListBooking
  } catch (error) {
    throw error
  }
}

export const getDetailBooking = async (bookingId) => {
  try {
    const getDetailBooking = await Booking.findById(bookingId)
      .populate('bookBy')
      .populate({
        path: 'carId',
        populate: [
          {
            path: 'model',
            model: 'Models'
          },
          { path: 'brand', model: 'Brands' }
        ]
      })
      .populate('contract')
    return getDetailBooking
  } catch (error) {
    throw error
  }
}
export const getBookedTimeSlots = async (carId) => {
  try {
    const getBookedTimeSlots = await BookedTimeSlot.find({ carId: carId })
    return getBookedTimeSlots
  } catch (error) {
    throw error
  }
}
