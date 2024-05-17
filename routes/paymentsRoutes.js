import { wrapRequestHandler } from '../utils/handlers.js'
import { createOrderPaymentController } from '../controllers/paymentsController.js'
import express from 'express'

const paymentsRoutes = express.Router()
/**
 * Description: Payment method vnpay
 * Path: /create_payment_url
 * Method: POST
 * Body:{ }
 */
paymentsRoutes.post('/create_payment_url', wrapRequestHandler(createOrderPaymentController))

export default paymentsRoutes
