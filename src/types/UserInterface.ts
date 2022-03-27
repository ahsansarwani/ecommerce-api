import { Document } from 'mongoose'

export interface UserInterface extends Document {
  _id: number
  firstname: string
  lastname: string
  email: string
  password: string
  address: string
  phone: string
  role: string
  orders: object
  system: string
}
