import { HTTP_STATUS } from '../constants/httpStatus.js'
import Car from '../models/cars.js'
import Rating from '../models/ratings.js'
import Brand from '../models/brands.js'
import Model from '../models/models.js'
import User from '../models/users.js'
import ApiError from '../utils/ApiError.js'

export const createCar = async (payloadBody) => {
  try {
    const result = await Car.create({ ...payloadBody, totalRatings: 5 })
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
  }
}

export const updateCar = async (carId, payload) => {
  try {
    console.log('Payload', payload)
    const updateCar = await Car.findByIdAndUpdate(carId, payload, { new: true })
    const car = await Car.findById(carId)
    console.log(car)
    return updateCar
  } catch (error) {
    throw new Error(error)
  }
}

export const getCarById = async (carId) => {
  console.log(carId)
  try {
    const getCarById = await Car.findById(carId).populate('brand', 'name').populate('model', 'name')
    return getCarById
  } catch (error) {
    console.log(error)
  }
}

export const getListCars = async (payload) => {
  try {
    // Filtering
    const queryObj = { ...payload }
    const { sort, fields, page = 1, limit = 8 } = payload
    const excludeFields = ['page', 'sort', 'limit', 'fields']
    excludeFields.forEach((el) => delete queryObj[el])
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    console.log(queryStr)

    let getListCars = Car.find(JSON.parse(queryStr))
      .populate('brand', 'name')
      .populate('model', 'name')
      .populate('user', 'fullname')

    // Sorting
    if (sort) {
      const sortBy = sort.split(',').join(' ')
      getListCars = getListCars.sort(sortBy)
    } else {
      getListCars = getListCars.sort('-createdAt')
    }

    // Limiting the fields
    if (fields) {
      const field = fields.split(',').join(' ')
      getListCars = getListCars.select(field)
    } else {
      getListCars = getListCars
    }

    // pagination

    const skip = (page - 1) * limit
    getListCars = getListCars.skip(skip).limit(limit)
    if (page) {
      const carCount = await Car.countDocuments()
      if (skip >= carCount) throw new Error('This Page does not exist')
    }
    const totalCars = await Car.countDocuments()
    const totalPages = Math.ceil(totalCars / limit)
    const currentPage = page ? parseInt(page) : 1
    const result = {
      cars: await getListCars,
      totalPages,
      currentPage
    }
    return result
  } catch (error) {
    console.log(error)
  }
}

export const ratings = async (user_id, payload) => {
  try {
    const { carId, bookingId, star, comment } = payload
    const newRatings = new Rating({
      postBy: user_id,
      carId,
      bookingId,
      star,
      comment
    })
    const savedRating = await newRatings.save()

    const ratings = await Rating.find({ carId: carId })
    const totalStars = ratings.reduce((total, rating) => total + rating.star, 0)
    const newTotalRatings = (ratings.length > 0 ? totalStars / ratings.length : 0).toFixed(1)

    // Cập nhật totalRatings của Car
    await Car.updateOne({ _id: carId }, { totalRatings: newTotalRatings })

    return savedRating // Trả về đánh giá đã lưu
  } catch (error) {
    throw error
  }
}
export const updateRatingsByBooking = async (bookingId, payload) => {
  try {
    //Tìm đánh giá liên quan đến bookingId được cung cấp
    const existingRating = await Rating.findOne({ bookingId })

    if (!existingRating) {
      throw new Error('Rating not found for the given bookingId')
    }

    // Cập nhật đánh giá
    const updatedRating = await Rating.findByIdAndUpdate(existingRating._id, payload, { new: true })

    // Recalculate the average rating for the associated car
    const ratings = await Rating.find({ carId: updatedRating.carId })
    const totalStars = ratings.reduce((total, rating) => total + rating.star, 0)
    const newTotalRatings = (ratings.length > 0 ? totalStars / ratings.length : 0).toFixed(1)

    // Cập nhật TotalRatings của car tương ứng
    await Car.updateOne({ _id: updatedRating.carId }, { totalRatings: newTotalRatings })

    return updatedRating // Trả về đánh giá đã cập nhật
  } catch (error) {
    throw error
  }
}

export const getRatingsOfCar = async (carId, page = 1, limit = 4) => {
  try {
    const skip = (page - 1) * limit
    const getRatingsOfCar = await Rating.find({ carId: carId })
      .populate('postBy', 'fullname profilePicture')
      .skip(skip)
      .limit(limit)

    const totalReviews = await Rating.countDocuments({ carId: carId })

    const totalPages = Math.ceil(totalReviews / limit)

    return { getRatingsOfCar, totalPages, page }
  } catch (error) {
    throw Error(error)
  }
}

export const getRatingByBooking = async (bookingId) => {
  try {
    const getRatingByBooking = await Rating.find({ bookingId: bookingId })
    return getRatingByBooking
  } catch (error) {
    throw Error(error)
  }
}

export const likeCars = async (user_id, carId) => {
  try {
    const car = await Car.findById(carId)
    const isLiked = car?.likes?.find((el) => el.toString() === user_id)
    if (isLiked) {
      const result = await Car.findByIdAndUpdate(carId, { $pull: { likes: user_id } }, { new: true })
      return result
    } else {
      const result = await Car.findByIdAndUpdate(carId, { $push: { likes: user_id } }, { new: true })
      return result
    }
  } catch (error) {
    throw Error(error)
  }
}

export const getCarsLikedByUser = async (userId) => {
  try {
    const likedCars = await Car.find({ likes: userId }).populate('brand').populate('model')
    return likedCars
  } catch (error) {
    throw new Error('Error fetching liked cars for the user')
  }
}
