import express from 'express'
import { createBrand, getBrands } from '../controllers/brandsController.js'
import { wrapRequestHandler } from '../utils/handlers.js'
import { accessTokenValidator, adminValidator } from '../middlewares/usersMiddleware.js'
const brandsRoutes = express.Router()

brandsRoutes.post('/createBrand', accessTokenValidator, adminValidator, wrapRequestHandler(createBrand))
brandsRoutes.get('/', wrapRequestHandler(getBrands))

export default brandsRoutes
