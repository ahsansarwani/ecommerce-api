
//@ts-nocheck
import { Schema } from 'mongoose'
import { BannerInterface } from 'src/types/admin/BannerInterface'

const BannerSchema = new Schema<BannerInterface>({
  image: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
}, { timestamps: true })

export default BannerSchema
  
