import mongoose, { Document } from 'mongoose'

export interface BannerInterface extends Document {
  _id: mongoose.Types.ObjectId
  image: string
  title: string
}
