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

const getUserDetails = async (req: Request, res: Response) => {
  const { api_key } = req.headers
  if (!api_key) {
    return res.status(400).json({
      message: 'Invalid data!'
    })
  }
  try {
    const user = await UsersModel.findOne({ api_key })
    if (!user) {
      return res.status(400).json({
        message: 'User not found!'
      })
    }
    return res.status(200).json({
      message: 'User found!',
      data: {
        api_key: user.api_key,
        name: user.name,
        email: user.email,
        creation_date: user.creation_date,
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

const updateUser = async (req: Request, res: Response) => {
  const { name, password, email } = req.body
  const { api_key } = req.headers
  if (!api_key || !name || !password || !email || !email.includes('@')) {
    return res.status(400).json({
      message: 'Invalid data!'
    })
  }
  try {
    const user = await UsersModel.findOne({ api_key })
    if (!user) {
      return res.status(400).json({
        message: 'User not found!'
      })
    }
    user.name = name
    user.password = await bcrypt.hash(password, 10)
    user.email = email
    await user.save()
    return res.status(200).json({
      message: 'User updated successfully!'
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'Something went wrong!'
    })
  }
}

const refreshToken = async (req: Request, res: Response) => {
  const { api_key } = req.headers
  if (!api_key) {
    return res.status(400).json({
      message: 'Invalid data!'
    })
  }
  try {
    const user = await UsersModel.findOne({ api_key })
    if (!user) {
      return res.status(400).json({
        message: 'User not found!'
      })
    }
    user.api_key = totp(process.env.TOTP_SECRET, {
      digits: 18
    })
    await user.save()
    return res.status(200).json({
      message: 'Token refreshed successfully!',
      data: {
        api_key: user.api_key
      }
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'Something went wrong!'
    })
  }
}

const deleteUser = async (req: Request, res: Response) => {}

export { test, getUserDetails, addUser, updateUser, refreshToken, deleteUser }
