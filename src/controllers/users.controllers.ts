import { Request, Response } from 'express'
import UsersModel from '../models/users.models'

const test = async (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Users controller works!'
  })
}

export { test }
