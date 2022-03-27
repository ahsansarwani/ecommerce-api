import mongoose, { Document } from 'mongoose'

export interface ReviewInterface extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  rating: string
  comment: string
}
