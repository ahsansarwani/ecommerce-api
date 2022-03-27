//@ts-nocheck

import { Schema } from 'mongoose'
import { OrderInterface } from 'src/types/OrderInterface'
import { OrderDetailInterface } from 'src/types/OrderDetailInterface'
import AddonSchema from './admin/Addon'

const orderDetailSchema = new Schema<OrderDetailInterface>({
  itemId: {
    type: String,
    required: true,
  },
  itemPrice: {
    type: String,
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  itemImage: {
    type: String
  },
  addons: {
    type: [AddonSchema],
    default: () => ({})
  },
  qty: {
    type: Number,
    required: true
  }
}, { timestamps: true })

const OrderSchema = new Schema<OrderInterface>({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  driver: {
    type: String,
    required: false
  },
  orderTotal: {
    type: Number,
    required: true
  },
  paymentType: {
    // Cash(0) or Credit card(1)
    type: Number,
    required: true
  },
  orderType: { 
    // delivery(0) or pickup(1)
    type: Number,
    required: true
  },
  orderDetails: {
    type: [orderDetailSchema],
    default: () => ({})
  },
  email: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  promoCode: {
    type: String,
    required: false
  },
  promoCodePercentage: {
    type: Number,
    required: false
  },
  discountAmount: {
    type: Number,
    required: false
  },
  tax: {
    type: Number,
    required: true
  },
  taxAmount: {
    type: Number,
    required: true
  },
  refund: {
    type: Schema.Types.Mixed,
    default: () => ({})
  },
  deliveryCharge: {
    type: Number,
    required: false
  },
  orderNotes: {
    type: String,
    required: false
  },
  orderFrom: { 
    // web or pos
    type: String,
    required: true
  },
  orderStatus: { 
    // orderReceived(0) | progress(1) / In the Kitchen(1) | Ready for delivery / Pick up(2) | pickedUp(3) / delivered(3) | Cancelled(4) | Partial refund(5) || Full refund(6)
    type: Number,
    required: true
  },
  isNotification: {
    // orderReceived(0) | orderIsReady(1) | deliveredOrPickedup(2)
    type: Number,
    required: true
  },
  deliveryOrPickupDate: {
    type: String,
    required: false
  },
  deliveryOrPickupTime: {
    type: String,
    required: false
  },
  createdAt: {
    type: String,
    default: () => String(new Date().toISOString()).split('T')[0]
  },
}, { timestamps: { updatedAt: true }  
})

export default OrderSchema
