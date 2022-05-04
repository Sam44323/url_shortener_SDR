import { prop, getModelForClass } from '@typegoose/typegoose'

class Admin {
  @prop({ required: true, type: String })
  email: string

  @prop({ required: true, type: String })
  password: string

  @prop({ required: true, type: Boolean, default: false })
  superAdmin: boolean
}

const AdminModel = getModelForClass(Admin)
export default AdminModel
