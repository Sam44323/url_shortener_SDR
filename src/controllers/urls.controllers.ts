import { Request, Response } from 'express'
import UrlModel from '../models/urls.models'
import { Base64 } from 'js-base64'

const test = async (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Url controller works!'
  })
}

const generate = async (req: Request, res: Response) => {}

const getTinyUrl = async (req: Request, res: Response) => {}

const deleteTinyUrl = async (req: Request, res: Response) => {}

export { test, generate, getTinyUrl, deleteTinyUrl }
