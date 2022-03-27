//@ts-nocheck

import { Schema } from 'mongoose'
import { PromocodeInterface } from 'src/types/admin/PromocodeInterface'

const PromocodeSchema = new Schema<PromocodeInterface>({
  title: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  },
}, { timestamps: true })

export default PromocodeSchema
  
