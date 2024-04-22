import moment from 'moment'
import Coupon from '../models/coupons.js'

export const createCoupons = async (payload) => {
  try {
    const { timeExpired } = payload
    const expired = moment.utc(timeExpired).toDate()
    const createCoupons = await Coupon.create({ ...payload, timeExpired: expired })
    return createCoupons
  } catch (error) {
    throw Error(error)
  }
}

export const getCoupons = async () => {
  try {
    const getCoupons = Coupon.find().sort({ createdAt: -1 })
    return getCoupons
  } catch (error) {
    throw Error(error)
  }
}
export const getCouponById = async (couponId) => {
  console.log(couponId)
  try {
    const getCouponById = await Coupon.findById(couponId)
    return getCouponById
  } catch (error) {
    console.log(error)
  }
}

export const updateCoupon = async (couponId, payload) => {
  try {
    const { timeExpired } = payload
    const expired = moment.utc(timeExpired).toDate()
    const updateCoupon = await Coupon.findByIdAndUpdate(
      couponId,
      { ...payload, timeExpired: expired },
      { new: true }
    )
    return updateCoupon
  } catch (error) {
    throw new Error(error)
  }
}
export const deleteCoupon = async (couponId) => {
  try {
    await Coupon.findByIdAndDelete(couponId)
    return { message: 'Delete thanh cong!' }
  } catch (error) {
    throw new Error(error)
  }
}
