import { MongoClient } from 'mongodb'
import { config } from 'dotenv'
import mongoose from 'mongoose'
config()

class databaseService {
  connect() {
    return mongoose
      .connect(
        process.env.CONNECTION_URL
      )
      .then(() => {
        console.log('Connected to MongoDB')
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

const databaseServices = new databaseService()

export default databaseServices
