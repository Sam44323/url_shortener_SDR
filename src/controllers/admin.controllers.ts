import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import AdminModel from '../models/admins.model'

const test = async (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Admin controller works'
  })
}

const addAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const admin = await AdminModel.findOne({ email })
    if (admin) {
      res.status(404).json({
        message: 'Admin already exists'
      })
      return
    }
    const hashPassword = await bcrypt.hash(password, 12)
    const newAdmin = new AdminModel({
      email,
      password: hashPassword,
      superAdmin: false
    })
    await newAdmin.save()
    res.status(201).json({
      message: 'Admin created successfully',
      data: {
        email: newAdmin.email,
        superAdmin: newAdmin.superAdmin
      }
    })
  } catch (err) {
    console.log(err)
    res.status(404).json({
      message: 'Error while adding admin!'
    })
  }
}

const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const admin = await AdminModel.findOne({ email })
    if (!admin) {
      res.status(404).json({
        message: 'Admin does not exist'
      })
      return
    }
    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      res.status(404).json({
        message: 'Invalid password'
      })
      return
    }
    const token = jwt.sign(
      {
        email: admin.email,
        superAdmin: admin.superAdmin
      },
      process.env.SECRET_PHRASE
    )
    res.status(200).json({
      message: 'Admin logged in successfully',
      data: {
        token
      }
    })
  } catch (err) {
    console.log(err)
    res.status(404).json({
      message: 'Error while logging in!'
    })
  }
}

const updateAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    let admin = await AdminModel.findOne({ email })
    if (!admin) {
      res.status(404).json({
        message: 'Admin does not exist'
      })
      return
    }
    const hashPassword = await bcrypt.hash(password, 12)
    await AdminModel.updateOne({ email }, { password: hashPassword })
    const adminData = await AdminModel.findOne({ email })
    const token = jwt.sign(
      {
        email: adminData.email,
        superAdmin: adminData.superAdmin
      },
      process.env.SECRET_PHRASE
    )
    res.status(200).json({
      message: 'Admin updated successfully',
      data: {
        token
      }
    })
  } catch (err) {
    console.log(err)
    res.status(404).json({
      message: 'Error while updating admin!'
    })
  }
}

const adminStatus = async (req: Request, res: Response) => {
  const { email } = req.body
  const { token } = req.headers
  let tokenValue: any

  try {
    const admin = await AdminModel.findOne({ email })
    if (!admin) {
      res.status(404).json({
        message: 'Admin does not exist'
      })
      return
    }
    jwt.verify(token as string, process.env.SECRET_PHRASE, (_err, decoded) => {
      tokenValue = decoded
    })
    if (!tokenValue.superAdmin) {
      res.status(401).json({
        message: 'Unauthorized for deletion'
      })
      return
    }
    await AdminModel.updateOne({ email }, { superAdmin: !admin.superAdmin })
    res.status(200).json({
      message: 'Admin status updated successfully'
    })
  } catch (err) {
    console.log(err)
    res.status(404).json({
      message: 'Error while updating admin!'
    })
  }
}

const deleteAdmin = async (req: Request, res: Response) => {
  const { email } = req.body
  const { token } = req.headers
  let tokenValue: any

  try {
    const admin = await AdminModel.findOne({ email })
    if (!admin) {
      res.status(404).json({
        message: 'Admin does not exist'
      })
      return
    }
    jwt.verify(token as string, process.env.SECRET_PHRASE, (_err, decoded) => {
      tokenValue = decoded
    })
    if (!tokenValue.superAdmin) {
      res.status(401).json({
        message: 'Unauthorized for deletion'
      })
      return
    }
    await AdminModel.deleteOne({ email })
    res.status(200).json({
      message: 'Admin deleted successfully'
    })
  } catch (err) {
    console.log(err)
    res.status(404).json({
      message: 'Error while deleting admin!'
    })
  }
}

export { test, addAdmin, adminLogin, updateAdmin, adminStatus, deleteAdmin }
