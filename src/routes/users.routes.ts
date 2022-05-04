import { Router } from 'express'
import {
  test,
  addUser,
  getUserDetails,
  updateUser,
  refreshToken,
  deleteUser
} from '../controllers/users.controllers'

const userRouter = Router() // router initialization for url

userRouter.get('/test', test) // testing the url controller
userRouter.post('/addUser', addUser) // adding a new user
userRouter.get('/userDetails', getUserDetails) // getting the user details
userRouter.patch('/updateUser', updateUser) // updating the user details
userRouter.patch('/refreshToken', refreshToken) // refreshing the api_token
userRouter.delete('/deleteUser', deleteUser) // deleting the user

export default userRouter
