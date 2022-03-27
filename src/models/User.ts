//@ts-nocheck
import { ObjectId } from 'mongodb'
import { Schema } from 'mongoose'
import { UserInterface } from 'src/types/UserInterface'

const UserSchema = new Schema<UserInterface>({
  _id: {
    type: ObjectId,
    required: true
  },
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
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
  address:{
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    required: true,
    default: 'customer'
  },
  orders: {
    type: Array,
    default: []
  },
  system: {
    type: String,
    required: true
  }
}, { timestamps: true })

export default UserSchema
