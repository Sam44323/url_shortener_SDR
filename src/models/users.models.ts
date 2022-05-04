import { prop, getModelForClass } from '@typegoose/typegoose'

class Users {
  @prop({ required: true, type: String })
  api_key: string

  @prop({ required: true, type: String })
  name: string

  @prop({ required: true, type: String })
  email: string

  @prop({ required: true, type: String })
  creation_date: string
}

const UsersModel = getModelForClass(Users)
export default UsersModel
