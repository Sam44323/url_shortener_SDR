import { Request, Response } from 'express'
import UrlModel from '../models/urls.models'

const test = async (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Url controller works!'
  })
}

export { test }
