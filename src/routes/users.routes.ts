import { Router } from 'express'
import { test } from '../controllers/users.controllers'

const userRouter = Router()

userRouter.get('/test', test)
userRouter.post('/addUser')
userRouter.patch('/updateUser')
userRouter.patch('/refreshToken')
userRouter.delete('/deleteUser')

export default userRouter
