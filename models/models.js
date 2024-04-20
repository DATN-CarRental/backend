import mongoose from 'mongoose'

const modelsSchema = new mongoose.Schema(
  {
    brand: {
      type: mongoose.Types.ObjectId,
      ref: 'Brands'
    },
    name: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

const Model = mongoose.model('Models', modelsSchema)

export default Model
