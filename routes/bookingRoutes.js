import express from 'express'
import { wrapRequestHandler } from '../utils/handlers.js'
import { accessTokenValidator, adminValidator } from '../middlewares/usersMiddleware.js'
import {
  bookRecord,
  cancelBooking,
  createBooking,
  getBookedTimeSlots,
  getDetailBooking,
  getHistoryBooking,
  getListBooking,
  deleteBookedTimeSlots
} from '../controllers/bookingsController.js'

const bookingRoutes = express.Router()

bookingRoutes.post('/:carId', accessTokenValidator, wrapRequestHandler(createBooking))
bookingRoutes.post('/bookRecord/:carId', accessTokenValidator, wrapRequestHandler(bookRecord))
bookingRoutes.get('/historyBooking', accessTokenValidator, wrapRequestHandler(getHistoryBooking))
bookingRoutes.get('/', wrapRequestHandler(getListBooking))
bookingRoutes.get('/:carId', wrapRequestHandler(getBookedTimeSlots))
bookingRoutes.get('/detail-booking/:bookingId', accessTokenValidator, wrapRequestHandler(getDetailBooking))
bookingRoutes.delete('/:bookingId', accessTokenValidator, wrapRequestHandler(cancelBooking))

bookingRoutes.delete('/deleteBookedTimeSlots/:carId', accessTokenValidator, wrapRequestHandler(deleteBookedTimeSlots))
export default bookingRoutes
