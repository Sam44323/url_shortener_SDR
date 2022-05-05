import { Request, Response } from 'express'
import UrlModel from '../models/urls.models'
import UsersModel from '../models/users.models'
import { Base64 } from 'js-base64'

/**
 * @description: This function is used to test the uptime of url controller
 * @param _req the request for the controller
 * @param res the response for the controller
 */

const test = async (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Url controller works!'
  })
}

/**
 * @description: This function is used to generate a new short url/redirect for an existing url
 * @param req the request for the controller
 * @param res the response for the controller
 */

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
      // if the url is already in the database, return the short url with redirection
      return res.status(302).json({
        message: 'Url already exists, redirecting...',
        url: `http://localhost:${process.env.PORT || 3001}/${
          urlObject.short_url
        }`,
        original_url: url.original_url
      })
    }

    // creating a new object for short_url
    const shortUrl = await UrlModel.create({
      long_url: url,
      user_id: user._id,
      short_url: Base64.encode(url).slice(0, 8)
    })
    await shortUrl.save()
    user.url_ids.push(shortUrl._id) // adding the url_id to the user_object
    await user.save() // updating the user_data
    res.status(200).json({
      message: 'Url generated successfully',
      url: `http://localhost:${process.env.PORT || 3001}/${shortUrl.short_url}`,
      original_url: url.original_url
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Error generating url'
    })
  }
}

/**
 * @description: This function is used to fetch the url details based on url_id
 * @param req the request for the controller
 * @param res the response for the controller
 */

const getTinyUrl = async (req: Request, res: Response) => {
  const { url_id } = req.body
  try {
    const urlObject = await UrlModel.findById(url_id)
    if (!urlObject) {
      return res.status(404).json({
        message: 'Url not found'
      })
    }

    // returning the url data with redirection order
    res.status(302).json({
      message: 'Url Data. redirecting...',
      url: `http://localhost:${process.env.PORT || 3001}/${
        urlObject.short_url
      }`,
      original_url: urlObject.long_url
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Error getting url'
    })
  }
}

/**
 * @description: This function is used to delete an existing short_url details
 * @param req the request for the controller
 * @param res the response for the controller
 */

const deleteTinyUrl = async (req: Request, res: Response) => {
  const { url_id } = req.params
  const { api_key } = req.params
  try {
    const user = await UsersModel.findOne({ api_key }) // checking the authenticity of the api_key
    if (!user) {
      return res.status(401).json({
        message: 'Invalid api key'
      })
    }
    const urlObject = await UrlModel.findById(url_id)
    if (urlObject.user_id.toString() !== user._id.toString()) {
      // checking the user_id of the url_id with the curr_user_id to check the eligibility for deletion of the requested url
      return res.status(401).json({
        message: 'Unauthorized'
      })
    } else if (!urlObject) {
      // if the url is not found, with the id
      return res.status(404).json({
        message: 'Url not found'
      })
    }
    await urlObject.remove() // removing the url
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
