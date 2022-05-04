import { Router } from 'express'
import { test, addUser, getUserDetails } from '../controllers/users.controllers'

const userRouter = Router()

userRouter.get('/test', test)
userRouter.post('/addUser', addUser)
userRouter.get('/userDetails', getUserDetails)
userRouter.patch('/updateUser')
userRouter.patch('/refreshToken')
userRouter.delete('/deleteUser')

export default userRouter
