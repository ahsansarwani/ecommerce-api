//@ts-nocheck

import { Schema } from 'mongoose'
import { AddonInterface } from 'src/types/AddonInterface'

const AddonSchema = new Schema<AddonInterface>({
  name: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
  },

  price: {
    type: Number,
    trim: true,
    required: true
  },
  
  status: {
    type: String,
    trim: true,
    lowercase: true
    // required: true
  }
}, { timestamps: true })

export default AddonSchema
  
