import { prop, getModelForClass } from '@typegoose/typegoose'
import mongoose from 'mongoose'

class User {
  @prop({ required: true, type: String })
  api_key: string

  @prop({ required: true, type: String })
  name: string

  @prop({ required: true, type: String })
  password: string

  @prop({ required: true, type: String })
  email: string

  @prop({ required: true, type: String })
  creation_date: string

  @prop({ type: Array, default: [] })
  url_ids: mongoose.Schema.Types.ObjectId[]
}

const UsersModel = getModelForClass(User)
export default UsersModel
