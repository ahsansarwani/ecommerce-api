//@ts-nocheck

import { Schema } from 'mongoose'
import { PromotionInterface } from 'src/types/admin/PromotionInterface'

const PromocodeSchema = new Schema<PromotionInterface>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  discount: {
    type: Number,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
}, { timestamps: true })

export default PromocodeSchema
  
