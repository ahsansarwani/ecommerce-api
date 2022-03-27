//@ts-nocheck

import { Schema } from 'mongoose'
import { AdminInterface } from 'src/types/admin/AdminInterface'

const AdminSchema = new Schema<AdminInterface>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  companyName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  address: {
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
  phone: {
    type: String,
    trim: true
  },
  businessCategory: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    required: true,
    default: 'admin'
  },
  dbName: {
    type: String,
    required: true
  }
}, { timestamps: true })

export default AdminSchema
