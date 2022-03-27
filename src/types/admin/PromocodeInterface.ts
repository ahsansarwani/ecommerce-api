import mongoose, { Document } from 'mongoose'

export interface PromocodeInterface extends Document {
  _id: mongoose.Types.ObjectId
  title: string
  code: string
  description: string
  discount: number
  status: string
}
