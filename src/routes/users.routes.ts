import { Router } from 'express'
import { test } from '../controllers/users.controllers'

const userRouter = Router()

userRouter.get('/test', test)

export default userRouter
