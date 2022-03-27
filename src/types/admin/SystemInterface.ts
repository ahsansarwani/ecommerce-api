import mongoose, { Document } from 'mongoose'

export interface SystemInterface extends Document {
  _id: mongoose.Types.ObjectId
  companyName: string
  businessEmail: string
  address: string
  currency: string
  deliveryCharge: number
  tax: number
  logo: string
  favicon: string
  facebook: string
  twitter: string
  instagram: string
  snapchat: string
  tiktok: string
  termsConditions: string
  privacyPolicy: string
  about: string
  businessPhone: string
  businessCategory: string
  system: string
}
