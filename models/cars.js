import mongoose from 'mongoose'

const carsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    brandId: {
      type: mongoose.Types.ObjectId,
      ref: 'Brands'
    },
    modelId: {
      type: mongoose.Types.ObjectId,
      ref: 'Models'
    },
    numberSeat: {
      type: String,
      require: true
    },
    yearManufacture: {
      type: String,
      require: true
    },
    transmissions: {
      type: String,
      enum: ['manual', 'auto']
    },
    description: {
      type: String,
      require: true
    },
    thumb: {
      type: String
    },
    images: {
      type: Array
    },
    numberCar: {
      type: String
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    cost: {
      type: Number
    },
    totalRatings: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

const Car = mongoose.model('Cars', carsSchema)

export default Car
