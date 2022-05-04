import { Router } from 'express'
import {
  test,
  getUser,
  addUser,
  getUsers,
  userAccess
} from '../controllers/signupUsers.controllers'

const userRouter = Router()

userRouter.get('/test', test)
userRouter.post('/addUser', addUser)
userRouter.patch('/userAccess', userAccess)
userRouter.get('/getUsers', getUsers)
userRouter.get('/getUser/:email', getUser)

export default userRouter
