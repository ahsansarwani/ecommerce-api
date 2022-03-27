//@ts-nocheck
import { Request, Response } from 'express'
import BannerSchema from '../../models/admin/Banner'
import { connection } from '../../database/connections'

export const createBanner = async (req: Request, res: Response): Promise<object> => {

  //read from body
  const { title, image, bnkoDD } = req.body

  const Banner = connection(bnkoDD, 'Banner', BannerSchema)

  try {
    const doc = await Banner.create({ title, image })
    return res.status(200).json({
      message: `Banner '${title}' created successfully!`,
      doc
    })
  } catch (error) {
    return res.status(400).json({
      status: res.statusCode,
      error: error,
      message: error.message,
    })
  }
}

export const editBanner = async (req: Request, res: Response): Promise<object> => {
  // read from body
  const { id, title, image, bnkoDD } = req.body

  const Banner = connection(bnkoDD, 'Banner', BannerSchema)

  try {
    const doc = await Banner.findOneAndUpdate(
      { _id: id },
      { title, image })

    return res.status(200).json({
      message: `Banner updated successfully!`,
      doc
    })
  } catch (error) {
    return res.status(400).json({
      status: res.statusCode,
      error: error,
      message: error.message,
    })
  }
}

export const deleteBanner = async (req: Request, res: Response): Promise<object> => {
  // read from body
  const { id, bnkoDD } = req.body

  const Banner = connection(bnkoDD, 'Banner', BannerSchema)

  try {
    const doc = await Banner.deleteOne({ _id: id })
    return res.status(200).json({
      message: `Banner deleted successfully!`,
      doc
    })
  } catch (error) {
    return res.status(400).json({
      status: res.statusCode,
      error: error,
      message: error.message,
    })
  }
}


export const indexBanners = async (req: Request, res: Response): Promise<object> => {
  // read from body
  const { bnkoDD } = req.body

  const Banner = connection(bnkoDD, 'Banner', BannerSchema)

  try {
    const doc = await Banner.find()
    return res.status(200).json({
      // message: `Banner deled successfully!`,
      doc
    })
  } catch (error) {
    return res.status(400).json({
      status: res.statusCode,
      error: error,
      message: error.message,
    })
  }
}
