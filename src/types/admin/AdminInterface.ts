import mongoose, { Document } from 'mongoose'

export interface AdminInterface extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  companyName: string
  email: string
  password: string
  phone: string
  role: string
  bnkoDD: string
}
