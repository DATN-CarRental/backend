import User from '../models/users.js'
import Car from '../models/cars.js'
import Booking from '../models/bookings.js'
import Contract from '../models/contracts.js'
import FinalContract from '../models/finalContracts.js'
import mongoose from 'mongoose'
import { hashPassword } from '../utils/crypto.js'

export const getUsers = async () => {
  try {
    return await User.find({ role: 'user' }).populate('driverLicenses')
  } catch (error) {
    throw Error(error)
  }
}

export const getDetailUser = async (userId) => {
  try {
    const getDetailUser = await User.findById(userId).populate('driverLicenses')
    return getDetailUser
  } catch (error) {
    console.log(error)
  }
}

export const getStaffs = async () => {
  try {
    return await User.find({ role: 'staff' })
  } catch (error) {
    throw Error(error)
  }
}

export const createStaff = async (payload) => {
  const newUser = new User({
    ...payload,
    password: hashPassword(payload.password).toString(),
    role: 'staff'
  })
  try {
    const user = await newUser.save()
    return user
  } catch (error) {
    throw Error(error)
  }
}

export const updateStatusUser = async (userId, payload) => {
  try {
    const { status } = payload
    const updateStatusUser = await User.findByIdAndUpdate(userId, { status: status }, { new: true })
    return updateStatusUser
  } catch (error) {
    throw error
  }
}

export const updateStatusCar = async (carId, payload) => {
  try {
    const { status } = payload
    const updateStatusCar = await Car.findByIdAndUpdate(carId, { status: status }, { new: true })
    return updateStatusCar
  } catch (error) {
    throw error
  }
}

export const totalAdminDashboard = async () => {
  try {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1
    const totalUsers = await User.countDocuments()
    const totalCars = await Car.countDocuments()
    const bookingByMonth = await Booking.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $month: '$timeBookingStart' }, currentMonth] },
              { $eq: [{ $month: '$timeBookingEnd' }, currentMonth] }
            ]
          }
        }
      },
      {
        $count: 'totalResults'
      }
    ])
    const totalBookingByMonth = bookingByMonth.length > 0 ? bookingByMonth[0].totalResults : 0
    const revenue = await FinalContract.aggregate([
      {
        $group: {
          _id: null,
          totalCost: { $sum: '$cost_settlement' }
        }
      }
    ])
    const totalRevenue = revenue.length > 0 ? revenue[0].totalCost : 0
    return { totalUsers, totalCars, totalBookingByMonth, totalRevenue }
  } catch (error) {
    throw new Error(error)
  }
}

export const totalStaffDashboard = async (staffId) => {
  try {
    const ObjectId = mongoose.Types.ObjectId
    const totalCarsCreated = await Car.find({ user: staffId }).count()
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1
    const totalContractCreated = await Contract.find({ createBy: staffId }).count()
    const bookingByMonth = await Booking.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $month: '$timeBookingStart' }, currentMonth] },
              { $eq: [{ $month: '$timeBookingEnd' }, currentMonth] }
            ]
          }
        }
      },
      {
        $count: 'totalResults'
      }
    ])
    const totalBookingByMonth = bookingByMonth.length > 0 ? bookingByMonth[0].totalResults : 0
    const finalContracts = await FinalContract.aggregate([
      {
        $lookup: {
          from: 'contracts',
          localField: 'contractId',
          foreignField: '_id',
          as: 'contractInfo'
        }
      },
      {
        $match: {
          'contractInfo.createBy': new ObjectId(staffId)
        }
      },
      {
        $count: 'totalResults'
      }
    ])
    const totalFinalContracts = finalContracts.length > 0 ? finalContracts[0].totalResults : 0

    return { totalCarsCreated, totalBookingByMonth, totalContractCreated, totalFinalContracts }
  } catch (error) {
    throw new Error(error)
  }
}
export const getTotalRevenue = async () => {
  try {
    const finalContracts = await FinalContract.find()
    const currentYear = new Date().getFullYear()

    const revenueByMonth = finalContracts.reduce((result, contract) => {
      const finishDate = new Date(contract.timeFinish)

      const month = finishDate.getMonth() + 1
      const year = finishDate.getFullYear()

      // Only include months from the current year
      if (year === currentYear) {
        const key = `${year}-${month}`

        if (!result[key]) {
          result[key] = {
            month: `${month}`,
            totalRevenue: 0
          }
        }

        result[key].totalRevenue += contract.costSettlement
      }

      return result
    }, {})

    const revenueArray = Object.values(revenueByMonth)
    return revenueArray
  } catch (error) {
    console.error('Error in getTotalRevenue:', error)
    throw new Error('Error fetching total revenue')
  }
}
