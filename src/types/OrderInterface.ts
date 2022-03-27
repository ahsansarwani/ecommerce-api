import mongoose, { Document } from 'mongoose'
export interface OrderInterface extends Document {
  _id: mongoose.Types.ObjectId
  orderNumber: string
  name: string
  userId: string
  driver: string
  orderTotal: number
  paymentType: number
  orderType: number
  orderDetails: object 
  address: string
  email: string
  phone: string
  promoCode: string
  promoCodePercentage: string
  discountAmount: number
  tax: number
  taxAmount: number
  refund: any
  deliveryCharge: number
  orderNotes: string
  orderFrom: string
  orderStatus: number
  inKitchen: boolean
  isNotification: number
  deliveryOrPickupDate: string
  createdAt: string
  deliveryOrPickupTime: string
}
