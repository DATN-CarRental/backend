import Brand from "../models/brands.js"

export const createBrands = async (payload) => {
  const newBrands = new Brand({
    ...payload,
  })
  try {
    await newBrands.save()
  } catch (error) {
  }
}

export const getBrands = async () => {
  try {
    const getBrands = Brand.find()
    return getBrands
  } catch (error) {
    throw error
  }
}