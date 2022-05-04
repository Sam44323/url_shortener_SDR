import { Router } from 'express'
import {
  test,
  addUser,
  getUserDetails,
  updateUser,
  refreshToken,
  deleteUser
} from '../controllers/users.controllers'

const userRouter = Router()

userRouter.get('/test', test)
userRouter.post('/addUser', addUser)
userRouter.get('/userDetails', getUserDetails)
userRouter.patch('/updateUser', updateUser)
userRouter.patch('/refreshToken', refreshToken)
userRouter.delete('/deleteUser', deleteUser)

export default userRouter
