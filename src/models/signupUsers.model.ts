import { prop, getModelForClass } from '@typegoose/typegoose'
import mongoose from 'mongoose'

class SignupUser {
  @prop({ required: true, type: String })
  email: string

  @prop({ type: String })
  referralCode: string

  @prop({ type: String })
  proxyRefCode: string

  @prop({ required: true, type: Array, default: [] })
  referralList: mongoose.Types.Array<string>

  @prop({ required: true, type: Boolean, default: false })
  access: boolean
}

const SignupUserModel = getModelForClass(SignupUser)
export default SignupUserModel
