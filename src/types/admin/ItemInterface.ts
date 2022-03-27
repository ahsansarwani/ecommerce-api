import mongoose, { Document } from 'mongoose'

export interface ItemInterface extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  categories: object
  price: number
  quantity: number
  status: string
  description: string
  brand: string
  images: object
  tax: number
  ingredients: string
  addons: object
}
