import { Request, Response } from 'express'
import UrlModel from '../models/urls.models'
import UsersModel from '../models/users.models'
import { Base64 } from 'js-base64'

const test = async (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Url controller works!'
  })
}

const generate = async (req: Request, res: Response) => {
  const { url } = req.body
  const { api_key } = req.headers

  try {
    const user = await UsersModel.findOne({ api_key })
    if (!user) {
      return res.status(401).json({
        message: 'Unauthorized'
      })
    }
    const urlObject = await UrlModel.findOne({ url })
    if (urlObject) {
      return res.status(302).json({
        message: 'Url already exists, redirecting...',
        url: `http://localhost:${process.env.PORT || 3001}${
          urlObject.short_url
        }`,
        original_url: url.original_url
      })
    }
    const shortUrl = await UrlModel.create({
      long_url: url,
      user_id: user._id,
      short_url: Base64.encode(url)
    })
    await shortUrl.save()
    user.url_ids.push(shortUrl._id)
    await user.save()
    res.status(200).json({
      message: 'Url generated successfully',
      url: `http://localhost:${process.env.PORT || 3001}${shortUrl.short_url}`,
      original_url: url.original_url
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Error generating url'
    })
  }
}

const getTinyUrl = async (req: Request, res: Response) => {
  const { url_id } = req.params
  try {
    const urlObject = await UrlModel.findById(url_id)
    if (!urlObject) {
      return res.status(404).json({
        message: 'Url not found'
      })
    }
    res.status(302).json({
      message: 'Url Data. redirecting...',
      url: `http://localhost:${process.env.PORT || 3001}${urlObject.short_url}`,
      original_url: urlObject.long_url
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Error getting url'
    })
  }
}

const deleteTinyUrl = async (req: Request, res: Response) => {
  const { url_id } = req.params
  const { api_key } = req.params
  try {
    const user = await UsersModel.findOne({ api_key })
    if (!user) {
      return res.status(401).json({
        message: 'Invalid api key'
      })
    }
    const urlObject = await UrlModel.findById(url_id)
    if (urlObject.user_id.toString() !== user._id.toString()) {
      return res.status(401).json({
        message: 'Unauthorized'
      })
    } else if (!urlObject) {
      return res.status(404).json({
        message: 'Url not found'
      })
    }
    await urlObject.remove()
    res.status(200).json({
      message: 'Url deleted successfully'
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Error deleting url'
    })
  }
}

export { test, generate, getTinyUrl, deleteTinyUrl }
