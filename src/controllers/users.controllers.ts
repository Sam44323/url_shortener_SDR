import { Request, Response } from 'express'
import UsersModel from '../models/users.models'
import bcrypt from 'bcrypt'
import totp from 'totp-generator'

/**
 * @description: This function is used to test the uptime of user_controller
 * @param _req the request for the controller
 * @param res the response for the controller
 */

const test = async (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Users controller works!'
  })
}

/**
 * @description: This function is used for adding a new_user
 * @param req the request for the controller
 * @param res the response for the controller
 */

const addUser = async (req: Request, res: Response) => {
  const { name, password, email } = req.body

  // if the inputs are not valid
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

    // initializing a new user_object
    user = new UsersModel({
      email,
      name,
      password: await bcrypt.hash(password, 10),
      api_key: totp(process.env.TOTP_SECRET, {
        digits: 18
      }),
      creation_date: new Date().toISOString()
    })
    await user.save() // saving the user
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

/**
 * @description: This function is used for getting the user_details
 * @param req the request for the controller
 * @param res the response for the controller
 */

const getUserDetails = async (req: Request, res: Response) => {
  const { api_key } = req.headers

  // if the api_key is empty
  if (!api_key) {
    return res.status(400).json({
      message: 'Invalid data!'
    })
  }
  try {
    const user = await UsersModel.findOne({ api_key })
    if (!user) {
      // user is not valid
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

/**
 * @description: This function is used to update the user_details
 * @param req the request for the controller
 * @param res the response for the controller
 */

const updateUser = async (req: Request, res: Response) => {
  const { name, password, email } = req.body
  const { api_key } = req.headers

  // checking the validity of the payloads
  if (!api_key) {
    return res.status(400).json({
      message: 'Invalid data!'
    })
  }
  try {
    const user = await UsersModel.findOne({ api_key })
    if (!user) {
      // if the user doesn't exist
      return res.status(400).json({
        message: 'User not found!'
      })
    }

    // updating the user
    user.name = name ? name : user.name
    user.password = password ? await bcrypt.hash(password, 10) : user.password
    user.email = email ? email : user.email
    await user.save() // saving the updated_user
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

/**
 * @description: This function is used to refresh the api_token for an user
 * @param req the request for the controller
 * @param res the response for the controller
 */

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
    }) // generating a new api_key
    await user.save() // saving the updated_data
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

/**
 * @description: This function is used to delete an user
 * @param req the request for the controller
 * @param res the response for the controller
 */

const deleteUser = async (req: Request, res: Response) => {
  const { api_key } = req.headers
  if (!api_key) {
    return res.status(400).json({
      message: 'Invalid data!'
    })
  }
  try {
    const user = await UsersModel.findOne({ api_key })
    if (!user) {
      // checking the existence of the user
      return res.status(400).json({
        message: 'User not found!'
      })
    }
    await user.remove() // deleting the user
    return res.status(200).json({
      message: 'User deleted successfully!'
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'Something went wrong!'
    })
  }
}

export { test, getUserDetails, addUser, updateUser, refreshToken, deleteUser }
