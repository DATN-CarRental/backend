import Model from "../models/models.js"

export const createModels = async (payload) => {
  const newModels = new Model({
    ...payload,
  })
  try {
    await newModels.save()
  } catch (error) {
  }
}

export const getModelByBrand = async (brandId) => {
  try {
    const getModelByBrand = await Model.find({ brand: brandId })
    return getModelByBrand
  } catch (error) {
    throw error
  }
}