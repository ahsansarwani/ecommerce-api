import mongoose, { Document } from 'mongoose'

export interface PromotionInterface extends Document {
  _id: mongoose.Types.ObjectId
  title: string
  code: string
  discount: number
  status: string
  startDate: Date
  endDate: Date
}
