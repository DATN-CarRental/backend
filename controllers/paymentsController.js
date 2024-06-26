import dateFormat from 'dateformat'
import querystring from 'qs'
import crypto from 'crypto'
import { config } from 'dotenv'
import moment from 'moment'
import https from 'https'

config()

export const createOrderPaymentController = async (req, res, next) => {
  process.env.TZ = 'Asia/Ho_Chi_Minh'

  let date = new Date()
  let createDate = moment(date).format('YYYYMMDDHHmmss')

  let ipAddr =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress

  let tmnCode = process.env.VNP_TMN_CODE
  let secretKey = process.env.VNP_HASH_SECRET
  let vnpUrl = process.env.VNP_URL
  let returnUrl = `${process.env.FRONTEND_URL}/booking/${req.body.id}`
  let orderId = moment(date).format('DDHHmmss')
  let amount = req.body.amount
  let bankCode = req.body.bankCode
  let fullname = req.body.fullname
  let phone = req.body.phone
  let address = req.body.address

  let from = req.body.from
  let to = req.body.to

  let locale = req.body.language
  if (locale === null || locale === '') {
    locale = 'vn'
  }
  let currCode = 'VND'
  let vnp_Params = {}
  vnp_Params['vnp_Version'] = '2.1.0'
  vnp_Params['vnp_Command'] = 'pay'
  vnp_Params['vnp_TmnCode'] = tmnCode
  vnp_Params['vnp_Locale'] = locale
  vnp_Params['vnp_CurrCode'] = currCode
  vnp_Params['vnp_TxnRef'] = orderId

  vnp_Params['vnp_OrderInfo'] = `${fullname},:?${phone},:?${address},:?${from},:?${to}`

  vnp_Params['vnp_OrderType'] = 'other'
  vnp_Params['vnp_Amount'] = amount * 100
  vnp_Params['vnp_ReturnUrl'] = returnUrl
  vnp_Params['vnp_IpAddr'] = ipAddr
  vnp_Params['vnp_CreateDate'] = createDate
  if (bankCode !== null && bankCode !== '') {
    vnp_Params['vnp_BankCode'] = bankCode
  }

  vnp_Params = sortObject(vnp_Params)

  let signData = querystring.stringify(vnp_Params, { encode: false })

  let hmac = crypto.createHmac('sha512', secretKey)
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')
  vnp_Params['vnp_SecureHash'] = signed
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false })

  res.json(vnpUrl)
}
function sortObject(obj) {
  let sorted = {}
  let str = []
  let key
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key))
    }
  }
  str.sort()
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+')
  }
  return sorted
}
