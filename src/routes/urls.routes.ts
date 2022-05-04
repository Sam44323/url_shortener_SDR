import { Router } from 'express'
import {
  test,
  generate,
  getTinyUrl,
  deleteTinyUrl
} from '../controllers/urls.controllers'

const urlRouter = Router()

urlRouter.get('/test', test)
urlRouter.post('/generate', generate)
urlRouter.get('/tinyurl', getTinyUrl)
urlRouter.delete('/tinyurl/:url_id', deleteTinyUrl)

export default urlRouter
