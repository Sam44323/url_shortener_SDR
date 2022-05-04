import { Request, Response } from 'express'
import UsersModel from '../models/users.models'

const test = async (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Users controller works!'
  })
}

const addUser = async (req: Request, res: Response) => {}

const getUserDetails = async (req: Request, res: Response) => {}

const updateUser = async (req: Request, res: Response) => {}

const refreshToken = async (req: Request, res: Response) => {}

const deleteUser = async (req: Request, res: Response) => {}

export { test, getUserDetails, addUser, updateUser, refreshToken, deleteUser }
