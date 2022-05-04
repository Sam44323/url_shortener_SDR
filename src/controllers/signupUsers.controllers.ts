import { Request, Response } from 'express'
import randomstring from 'randomstring'
import SignupUserModel from '../models/signupUsers.model'

let refCodeInt = 1

const test = async (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'User controller works'
  })
}

const referralCodeUserAddition = async (req: Request, res: Response) => {
  const { email, refCode } = req.body
  try {
    // referral code validation
    const user = await SignupUserModel.findOne({ referralCode: refCode })
    if (!user) {
      return res.status(404).json({
        message: 'Invalid referral code'
      })
    }
    user.referralList.push(email)
    await user.save()
    const newUser = await SignupUserModel.create({
      email,
      referralCode: (refCodeInt++).toString(),
      proxyRefCode: refCode
    })
    return res.status(201).json({
      message: 'User added successfully'
    })
  } catch (err) {
    return err
  }
}

const addUser = async (req: Request, res: Response) => {
  const { email, refCode } = req.body
  try {
    const user = await SignupUserModel.findOne({ email })
    if (user) {
      return res.status(404).json({
        message: 'User already exists'
      })
    }
    if (refCode) {
      return referralCodeUserAddition(req, res)
    }
    const newUser = await SignupUserModel.create({
      email,
      referralCode: randomstring.generate(7)
    })
    await newUser.save()
    res.status(201).json({
      message: 'User added successfully'
    })
  } catch (err) {
    console.log(err)
    res.status(404).json({
      message: 'Error while adding_user!'
    })
  }
}

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await SignupUserModel.find().count()
    res.status(200).json({
      message: 'Users fetched successfully',
      users
    })
  } catch (err) {
    res.status(404).json({
      message: 'Error while fetching users!'
    })
  }
}

const getUser = async (req: Request, res: Response) => {
  const { email } = req.params
  try {
    const user = await SignupUserModel.findOne({ email })
    res.status(200).json({
      message: 'User fetched successfully',
      user
    })
  } catch (err) {
    res.status(404).json({
      message: 'Error while fetching user!'
    })
  }
}

const userAccess = async (req: Request, res: Response) => {
  const { email } = req.body
  try {
    const user = await SignupUserModel.findOne({ email })
    if (!user) {
      return res.status(404).json({
        message: 'Invalid email'
      })
    }
    user.access = true
    await user.save()
    if (user.referralList.length > 0) {
      user.referralList.forEach(async (refEmail) => {
        const refUser = await SignupUserModel.findOne({ email: refEmail })
        if (refUser) {
          refUser.access = true
          await refUser.save()
        }
      })
    }
    res.status(200).json({
      message: 'User access granted with referrals'
    })
  } catch (err) {
    res.status(404).json({
      message: 'Error while granting access!'
    })
  }
}

export { test, addUser, getUsers, getUser, userAccess }
