import DriverLicense from '../models/driverLicenses.js'
import User from '../models/users.js'

export const regisLicensesDriver = async (payloadBody, userId) => {
  try {
    const result = await DriverLicense.create({ ...payloadBody })
    await User.findByIdAndUpdate(userId, {
      driverLicenses: result._id
    })
    return result
  } catch (error) {
    console.log(error)
    throw error
  }
}
export const updateDriverLicense = async (did, payload) => {
  try {
    const updateDriverLicense = await DriverLicense.findByIdAndUpdate(did, { ...payload }, { new: true })
    return updateDriverLicense
  } catch (error) {
    throw new Error(error)
  }
}
export const acceptLicensesDriver = async (did, newStatus) => {
  try {
    const acceptLicensesDriver = await DriverLicense.findByIdAndUpdate(did, newStatus)
    return acceptLicensesDriver
  } catch (error) {
    throw new Error(error)
  }
}

export const getLicensesDrivers = async () => {
  try {
    const getLicensesDrivers = await DriverLicense.find()
      .sort({ status: 1 }) // Sắp xếp theo trạng thái tăng dần (Chưa xác thực trước)
      .exec()
    return getLicensesDrivers
  } catch (error) {
    throw new Error(error)
  }
}

export const deleteLicensesDrivers = async (did) => {
  try {
    const deleteDriverLicense = await DriverLicense.findByIdAndDelete(did)
    if (!deleteDriverLicense) {
      throw new Error('Driver license not found')
    }
    await User.deleteOne({ driverLicenses: did })
  } catch (error) {
    throw new Error(error)
  }
}
