import { Router } from 'express'
import {
  test,
  generate,
  getTinyUrl,
  deleteTinyUrl
} from '../controllers/urls.controllers'

const urlRouter = Router() // router initialization for url

urlRouter.get('/test', test) // testing the url controller
urlRouter.post('/generate', generate) // generating a new short_url
urlRouter.get('/tinyurl', getTinyUrl) // getting the short_url
urlRouter.delete('/deleteUrl', deleteTinyUrl) // deleting the short_url

export default urlRouter
