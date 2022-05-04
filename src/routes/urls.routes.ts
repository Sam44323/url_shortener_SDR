import { Router } from 'express'
import { test } from '../controllers/users.controllers'

const urlRouter = Router()

urlRouter.get('/test', test)

export default urlRouter
