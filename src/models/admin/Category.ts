//@ts-nocheck

import { Schema } from 'mongoose'
import { CategoryInterface } from 'src/types/admin/CategoryInterface'

const CategorySchema = new Schema<CategoryInterface>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  filename: {
    type: String,
    trim: true
  },
  downloadURL: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    required: true,
    lowercase: true
  }
}, { timestamps: true })

export default CategorySchema
  
