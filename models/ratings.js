import mongoose from "mongoose";

const ratingsSchema = new mongoose.Schema(

  {
    postBy: {
      type: mongoose.Types.ObjectId,
      ref: "Users"
    },
    carId: {
      type: mongoose.Types.ObjectId,
      ref: "Cars"
    },
    bookingId: {
      type: mongoose.Types.ObjectId,
      ref: "Bookings"
    },
    comment: {
      type: String,
    },
    star: {
      type: Number
    }
  },
  { timestamps: true }
);

const Rating = mongoose.model('Ratings', ratingsSchema)
export default Rating;