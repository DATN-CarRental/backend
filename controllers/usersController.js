import { USER_MESSAGES } from '../constants/messages.js'
import * as usersService from '../services/usersService.js'
import { transporter, MailGenerator } from '../utils/nodemailerConfig.js'
import { config } from 'dotenv'
config()
export const register = async (req, res, next) => {
  const result = await usersService.register(req.body)

  return res.json({
    message: USER_MESSAGES.REGISTER_SUCCESS,
    access_token: result.access_token.toString(),
    result: result.user,
    id: result.user_id
  })
}

export const login = async (req, res) => {
  const result = await usersService.login(req.user)

  return res.json({
    message: USER_MESSAGES.LOGIN_SUCCESS,
    access_token: result?.access_token?.toString(),
    result: { ...result.rest, role: result.role },
    id: result._id.toString(),
    role: result.role
  })
}

export const loginGoogle = async (req, res, next) => {
  console.log(req.body)
  const result = await usersService.google(req.body)

  console.log('result:', result.access_token)
  return res.json({
    message: USER_MESSAGES.LOGIN_SUCCESS,
    access_token: result?.access_token?.toString(),
    result: result.rest,
    id: result?._id?.toString()
  })
}

export const getUser = async (req, res, next) => {
  const result = await usersService.getUser(req.decoded_authorization)
  return res.json({
    message: USER_MESSAGES.GET_PROFILE_SUCCESS,
    result: result.getUser,
    id: result.user_id
  })
}

export const updateUser = async (req, res, next) => {
  const user_id = req.params.userId
  const { fullname, address, phoneNumber, gender, dateOfBirth } = req.body
  const result = await usersService.updateUser(user_id, { fullname, address, phoneNumber, gender, dateOfBirth }, req?.file)
  return res.json({
    message: USER_MESSAGES.UPDATE_PROFILE_SUCCESS,
    result: result.updateUser,
    id: result.user_id
  })
}

export const resetPassword = async (req, res, next) => {
  if (!req.app.locals.resetSession) {
    return res.json({ message: 'Session expired!' })
  }
  const result = await usersService.resetPassword(req.body)
  return res.json({
    message: USER_MESSAGES.RESET_PASSWORD_SUCCESS,
    result: result
  })
}

export const getUserByEmail = async (req, res, next) => {
  const result = await usersService.getUserByEmail(req.body)

  return res.json({
    message: USER_MESSAGES.GET_USERS_SUCCESS,
    result: result
  })
}

export const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body
  const userId = req.decoded_authorization.user_id // Assuming you store user_id in the decoded authorization token

  try {
    // Perform logic to change the password using the usersService
    const result = await usersService.changePassword(userId, oldPassword, newPassword)

    return res.json({
      message: USER_MESSAGES.CHANGE_PASSWORD_SUCCESS,
      result: result.user
    })
  } catch (error) {
    // Handle errors appropriately
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const registerMail = async (req, res, next) => {
  const { name, email, text, subject } = req.body

  // body of the email
  const bodyEmail = {
    body: {
      name: name,
      intro: text || "Welcome to Daily Tuition! We're very excited to have you on board.",
      outro: "Need help, or have questions? Just reply to this email, we'd love to help."
    }
  }

  const emailBody = MailGenerator.generate(bodyEmail)

  const message = {
    from: process.env.EMAIL,
    to: email,
    subject: subject || 'Signup Successful',
    html: emailBody
  }

  // send mail
  transporter
    .sendMail(message)
    .then(() => {
      return res.status(200).send({ msg: 'You should receive an email from us.' })
    })
    .catch((error) => res.status(500).send({ error }))
}

export const generateOTP = async (req, res, next) => {
  const email = req.body.email
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false
  })

  return res.json({ code: req.app.locals.OTP, email })
}

export const verifyOTP = async (req, res, next) => {
  const { code } = req.params
  const email = req.body.email
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null
    req.app.locals.resetSession = true
    return res.json({
      message: 'Verify Successsfully!',
      email
    })
  }

  return res.json({ message: 'Invalid OTP', email })
}
