import mongoose, { Document } from 'mongoose'

export interface SliderInterface extends Document {
  _id: mongoose.Types.ObjectId
  filename: string
  downloadURL: string
  title: string
  subtext: string
  status: string
}
