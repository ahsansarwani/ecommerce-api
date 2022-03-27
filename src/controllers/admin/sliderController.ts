//@ts-nocheck
import { Request, Response, NextFunction } from 'express'
import SliderSchema from '../../models/admin/Slider'
import { connection } from '../../database/connections'
import { BadRequest, NotFound } from '../../utils/error'

export const createSlider = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    //read from body
    const { filename, downloadURL, title, subtext, status, system } = req.body
  
    const { model: Slider, conn } = connection(system, 'Slider', SliderSchema)

    const doc = await Slider.create({ filename, downloadURL, title, subtext, status })

    if(!doc) throw new NotFound(`Something went wrong. Slider not created!`)

    // Close DB connection
    conn.close()

    return res.status(200).json({
      message: `Slider '${title}' created successfully!`,
      doc
    })
  } catch (error) {
    console.log(error.message)
    next(error)
  }
}

export const editSlider = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    // read from body
    const { _id, filename, downloadURL, title, subtext, status, system } = req.body
  
    const { model: Slider, conn } = connection(system, 'Slider', SliderSchema)

    const doc = await Slider.findOneAndUpdate(
      { _id },
      { filename, downloadURL, title, subtext, status })

      if(!doc) throw new BadRequest(`Something went wrong. Slider not updated!`)

      // Close DB connection
      conn.close()

    return res.status(200).json({
      message: `Slider updated successfully!`,
      doc
    })
  } catch (error) {
    console.log(error.message)
    next(error)
  }
}

export const deleteSlider = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    // read from body
    const { _id, system } = req.body

    const { model: Slider, conn } = connection(system, 'Slider', SliderSchema)

    const doc = await Slider.deleteOne({ _id })

    if(!doc) throw new BadRequest(`Something went wrong. Couldn't delete the slider!`)

    // Close DB connection
    conn.close()

    return res.status(200).json({
      message: `Slider deleted successfully!`,
      status: 'deleted',
      doc
    })
  } catch (error) {
    console.log(error.message)
    next(error)
  }
}

export const indexSliders = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    // read from body
    const { system } = req.body

    const { model: Slider, conn } = connection(system, 'Slider', SliderSchema)

    const doc = await Slider.find()

    if(!doc) throw new NotFound(`Couldn't load the sliders. Refresh the page or contact support!`)

    // Close DB connection
    conn.close()

    return res.status(200).json({
      doc
    })
  } catch (error) {
    console.log(error.message)
    next(error)
  }
}
