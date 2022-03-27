//@ts-nocheck

import { Schema } from 'mongoose'
import { ItemInterface } from 'src/types/admin/ItemInterface'

const ItemSchema = new Schema<ItemInterface>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  images: {
    type: Array,
    default: []
  },
  categories: {
    type: Array,
    default: []
  }, 
  price: {
    type: Number,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    trim: true
  },
  status: {
    type: String,
    required: true
  },
   description: {
    type: String,
    required: true,
    trim: true
  },
  ingredients: {
    type: String,
    trim: true
  },
  addons: {
    type: Array,
    default: []
  },
  brand: {
    type: String,
    trim: true
  },
  tax: {
    type: Number,
    trim: true
  }
}, { timestamps: true })

export default ItemSchema
  
