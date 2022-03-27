import mongoose, { Document } from 'mongoose'

export interface AccountSettingsInterface extends Document {
  _id: mongoose.Types.ObjectId
  companyName: string
  email: string
  phone: string
  address: string
  tax: number
  currency: string
  deliveryCharge: number
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
}
