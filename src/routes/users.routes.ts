import { Router } from 'express'
import { test } from '../controllers/users.controllers'

const userRouter = Router()

userRouter.get('/test', test)
userRouter.post('/addUser')
userRouter.get('/userDetails')
userRouter.patch('/updateUser')
userRouter.patch('/refreshToken')
userRouter.delete('/deleteUser')

export default userRouter
