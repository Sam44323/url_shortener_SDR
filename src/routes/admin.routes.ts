import { Router } from 'express'
import {
  test,
  addAdmin,
  adminLogin,
  updateAdmin,
  deleteAdmin,
  adminStatus
} from '../controllers/admin.controllers'

const adminRouter = Router()

adminRouter.get('/test', test)
adminRouter.post('/addAdmin', addAdmin)
adminRouter.post('/adminLogin', adminLogin)
adminRouter.patch('/updateAdmin', updateAdmin)
adminRouter.patch('/adminStatus', adminStatus)
adminRouter.delete('/deleteAdmin', deleteAdmin)

export default adminRouter
