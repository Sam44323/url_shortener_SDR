import { prop, getModelForClass } from '@typegoose/typegoose'
import mongoose from 'mongoose'

class Url {
  @prop({ required: true, type: String })
  short_url: string

  @prop({ required: true, type: String })
  long_url: string

  @prop({ required: true, type: String })
  user_id: mongoose.Schema.Types.ObjectId
}

const UrlModel = getModelForClass(Url)
export default UrlModel
