import { Request, Response } from 'express'
import UsersModel from '../models/users.models'
import errorCreator from '../utils/error'
import bcrypt from 'bcrypt'
import totp from 'totp-generator'

const test = async (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Users controller works!'
  })
}

const addUser = async (req: Request, res: Response) => {
  const { name, password, email } = req.body
  if (!name || !password || !email || !email.includes('@')) {
    return res.status(400).json({
      message: 'Invalid data!'
    })
  }
  try {
    let user = await UsersModel.findOne({ email })
    if (user) {
      return res.status(400).json({
        message: 'User already exists!'
      })
    }
    user = new UsersModel({
      email,
      name,
      password: await bcrypt.hash(password, 10),
      api_key: totp(process.env.TOTP_SECRET, {
        digits: 18
      }),
      creation_date: new Date().toISOString()
    })
    await user.save()
    return res.status(200).json({
      message: 'User created successfully!',
      data: {
        api_key: user.api_key,
        url_ids: user.url_ids
      }
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'Something went wrong!'
    })
  }
}

const getUserDetails = async (req: Request, res: Response) => {}

const updateUser = async (req: Request, res: Response) => {}

const refreshToken = async (req: Request, res: Response) => {}

const deleteUser = async (req: Request, res: Response) => {}

export { test, getUserDetails, addUser, updateUser, refreshToken, deleteUser }
