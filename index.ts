import express, { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import Logger from './src/utils/logger'
import mongoose from 'mongoose'

// routes

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())
app.use(helmet())

mongoose.connect(process.env.MONGO_URL, {
  // @ts-ignore
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const connection = mongoose.connection // connection from mongoose
// Once connection established
connection.once('open', () => {
  Logger.info('✅ MongoDB connection established successfully!')
})

// If error while connection
connection.on('error', (err: any) => {
  Logger.info('❌ Failed to connect to DB on startup ' + err.message)
})
// When the connection is disconnected
connection.on('disconnected', () => {
  Logger.info('🔌 Mongoose default connection to DB disconnected')
})

app.use(
  (
    error: { code: any; message: any },
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    Logger.info(`
    [${new Date().toLocaleString()}] : ❌ Error`)
    if (res.headersSent) {
      return next(error)
    }
    if (res.headersSent) {
      return
    }
    res.status(error.code || 500)
    res.json({ message: error.message || 'An unknown error occurred!' })
  }
)

const port = process.env.PORT || 3001
app.listen(port, () => {
  Logger.info(`✅ Backend is running on PORT: ${port}`)
})
