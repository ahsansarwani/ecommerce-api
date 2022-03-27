import mongoose, { Document } from 'mongoose'

export interface CategoryInterface extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  filename: string
  downloadURL: string
  status: string
}
