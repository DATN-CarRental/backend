import express from 'express'
import { createModels, getModelByBrand } from '../controllers/modelsController.js'
import { wrapRequestHandler } from '../utils/handlers.js'
import { adminValidator, staffValidator } from '../middlewares/usersMiddleware.js'
const modelsRoutes = express.Router()

modelsRoutes.post('/createModel', adminValidator || staffValidator, wrapRequestHandler(createModels))
modelsRoutes.get('/:brandId', wrapRequestHandler(getModelByBrand))

export default modelsRoutes
