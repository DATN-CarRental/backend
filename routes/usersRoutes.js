import express from 'express'
import {
  registerValidator,
  loginValidator,
  accessTokenValidator,
  adminValidator,
  staffValidator,
  adminAndStaffValidator
} from '../middlewares/usersMiddleware.js'
import { wrapRequestHandler } from '../utils/handlers.js'
import {
  register,
  login,
  loginGoogle,
  getUser,
  updateUser,
  resetPassword,
  getUserByEmail,
  changePassword,
  generateOTP,
  verifyOTP,
  registerMail
} from '../controllers/usersController.js'
import uploadCloud from '../utils/cloudinary.config.js'
const usersRoutes = express.Router()

/**
 * Description: Register a user
 * Path: /register
 * Method: POST
 * Body:{ email: string, password: string, confirm_password: string, date_of_birth: ISO8601}
 */
usersRoutes.post('/register', registerValidator, wrapRequestHandler(register))

/**
 * Description: Login a user
 * Path: /login
 * Method: POST
 * Body:{ email: string, password: string}
 */
usersRoutes.post('/login', loginValidator, wrapRequestHandler(login))

/**
 * Description: OAuth Google Account
 * Path: /google
 * Method: POST
 * Body:{ email: string, password: string,profilePicture: string}
 */
usersRoutes.post('/google', wrapRequestHandler(loginGoogle))

/**
 * Description: Get User
 * Path: /get-user
 * Method: GET
 * Headers: {Authorization: Bearer <access_token>}
 */
usersRoutes.get('/get-user', accessTokenValidator, wrapRequestHandler(getUser))

/**
 * Description: Get User
 * Path: /get-user
 * Method: GET
 * body: {email: string}
 */
usersRoutes.post('/get-user-by-email', wrapRequestHandler(getUserByEmail))

/**
 * Description: Update User
 * Path: /update-user
 * Method: POST
 * Body:{ email: string, password: string,profilePicture: string,...}
 */
usersRoutes.put(
  '/update-user/:userId',
  uploadCloud.single('profilePicture'),
  accessTokenValidator,

  wrapRequestHandler(updateUser)
)

/**
 * Description: Reset Password
 * Path: /reset-password
 * Method: PUT
 */
usersRoutes.put('/reset-password', wrapRequestHandler(resetPassword))

/**
 * Description: Register Mail
 * Path: /register-mail
 * Method: POST
 * Body: {email: String,name: string, text: String, subject: String}
 */

usersRoutes.put('/change-password', accessTokenValidator, wrapRequestHandler(changePassword))

/**
 * Description: Generate OTP
 * Path: /generate-otp
 * Method: GET
 * Body: {email: String}
 */
usersRoutes.get('/generate-otp', wrapRequestHandler(generateOTP))

/**
 * Description: Verify OTP
 * Path: /verify-otp
 * Method: GET
 */
usersRoutes.get('/verify-otp/:code', wrapRequestHandler(verifyOTP))

/**
 * Description: Register Mail
 * Path: /register-mail
 * Method: POST
 * Body: {email: String,name: string, text: String, subject: String}
 */
usersRoutes.post('/register-mail', wrapRequestHandler(registerMail))

export default usersRoutes
