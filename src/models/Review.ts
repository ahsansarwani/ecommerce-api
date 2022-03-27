//@ts-nocheck
import { Schema } from 'mongoose'
import { ReviewInterface } from 'src/types/ReviewInterface'

const ReviewSchema = new Schema<ReviewInterface>({
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true
  },
  comment: {
    type: String,
    required: true
  }
}, { timestamps: true })

export default ReviewSchema 
  
