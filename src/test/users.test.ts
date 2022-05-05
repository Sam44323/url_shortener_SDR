import express, { Express } from 'express'
import userRoutes from '../routes/users.routes'
import dotenv from 'dotenv'
import mongoose, { Connection } from 'mongoose'
import supertest from 'supertest'
import UserModel from '../models/users.models'

dotenv.config()

let app: Express, connection: Connection
app = express()
app.use(express.json())
app.use('/api/user', userRoutes)

mongoose.connect(process.env.MONGO_URL, {
  // @ts-ignore
  useNewUrlParser: true,
  useUnifiedTopology: true
})

connection = mongoose.connection
// Once connection established
connection.once('open', () => {
  console.log('✅ MongoDB connection established successfully!')
})

// If error while connection
connection.on('error', (err: any) => {
  console.log('❌ Failed to connect to DB on startup ' + err.message)
})
// When the connection is disconnected
connection.on('disconnected', () => {
  console.log('🔌 Mongoose default connection to DB disconnected')
})
