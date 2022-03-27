//@ts-nocheck

import { Schema } from 'mongoose'
import { SystemInterface } from 'src/types/admin/SystemInterface'

const SystemSchema = new Schema<SystemInterface>({
  companyName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  businessEmail: {
    type: String,
    trim: true
  },
  businessPhone: {
    type: String,
    trim: true
  },
  currency: {
    type: String,
    trim: true
  },
  deliveryCharge: {
    type: Number,
    trim: true 
  },
  tax: {
    type: Number,
    trim: true 
  },
  logo: {
    type: String,
    trim: true
  },
  favicon: {
    type: String,
  },
  facebook: {
    type: String,
    trim: true 
  },
  twitter: {
    type: String,
    trim: true 
  },
  instagram: {
    type: String,
    trim: true 
  },
  snapchat: {
    type: String,
    trim: true 
  },
  tiktok: {
    type: String,
    trim: true 
  },
  termsConditions: {
    type: String,
    trim: true 
  },
  privacyPolicy: {
    type: String,
    trim: true 
  },
  about: {
    type: String,
    trim: true 
  },
  businessCategory: {
    type: String,
    trim: true
  },
  system: {
    type: String,
    trim: true,
    unique: true
  }
}, { timestamps: true })

export default SystemSchema
