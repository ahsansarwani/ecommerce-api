import mongoose, { Document } from 'mongoose'

export interface AddonInterface extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  price: number
  status: string
}
