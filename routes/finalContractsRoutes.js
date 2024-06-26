import express from 'express'

import { wrapRequestHandler } from '../utils/handlers.js'
import {
  accessTokenValidator,
  adminAndStaffValidator,
  adminValidator,
  staffValidator
} from '../middlewares/usersMiddleware.js'
import {
  createFinalContract,
  getFinalContractById,
  getListFinalContracts,
  getFinalContractByUserId
} from '../controllers/finalContractsController.js'

const finalContractsRoutes = express.Router()

finalContractsRoutes.get('/listFinalContracts', adminAndStaffValidator, wrapRequestHandler(getListFinalContracts))
finalContractsRoutes.get('/', staffValidator, wrapRequestHandler(getFinalContractByUserId))
finalContractsRoutes.get('/:contractId', adminAndStaffValidator, wrapRequestHandler(getFinalContractById))
finalContractsRoutes.post('/create/:contractId', adminAndStaffValidator, wrapRequestHandler(createFinalContract))

export default finalContractsRoutes
