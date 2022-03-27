//@ts-nocheck

import { Schema } from 'mongoose'
import { SliderInterface } from 'src/types/admin/SliderInterface'

const SliderSchema = new Schema<SliderInterface>({
  title: {
    type: String,
    required: true
  },
  subtext: {
    type: String
  },
  status: {
    type: String,
    required: true,
    lowercase: true
  },
  filename: {
    type: String,
    required: true
  },
  downloadURL: {
    type: String,
    required: true
  }
}, { timestamps: true })

export default SliderSchema
  
