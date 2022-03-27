import mongoose, { Document } from 'mongoose'

export interface OrderDetailInterface extends Document {
  _id: mongoose.Types.ObjectId
  itemId: number | string
  itemPrice: string
  itemName: string
  itemImage: string
  addons: object
  addonsPrice: string
  addonsName: string
  qty: number
}
