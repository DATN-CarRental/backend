// import { defaultErrorHandler } from './middlewares/error.middlewares'
import usersRoutes from './routes/usersRoutes.js'
import carsRoutes from './routes/carsRoutes.js'
import brandsRoutes from './routes/brandsRoutes.js'
import modelsRoutes from './routes/modelsRoutes.js'
import databaseServices from './services/databaseService.js'
import bodyParser from 'body-parser'
import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { config } from 'dotenv'
import couponsRoutes from './routes/couponsRoutes.js'

config()
const app = express()
console.log('hello')

databaseServices.connect()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`, // Thay đổi nguồn gốc tại đây nếu cần
    credentials: true // Cho phép sử dụng các credentials như cookie
  })
)
app.use(express.json())
app.use(cookieParser())

app.use('/users', usersRoutes)
app.use('/cars', carsRoutes)
app.use('/brands', brandsRoutes)
app.use('/models', modelsRoutes)
app.use('/coupons', couponsRoutes)

// app.use(defaultErrorHandler)
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})
