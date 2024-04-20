import mongoose from 'mongoose'

const brandsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
)

const Brand = mongoose.model('Brands', brandsSchema)

export default Brand
