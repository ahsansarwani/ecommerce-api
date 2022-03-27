//@ts-nocheck
import { Request, Response, NextFunction } from 'express'
import PromotionSchema from '../../models/admin/Promotion'
import { connection } from '../../database/connections'
import { BadRequest, NotFound } from '../../utils/error'

export const addPromotion = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    //read from body
    const { system, title, code, discount, status, startDate, endDate } = req.body

    const { model: Promotion, conn } = connection(system, 'Promotion', PromotionSchema)

    const doc = await Promotion.create({ title, code, discount, status, startDate, endDate })

    if(!doc) throw new NotFound(`Something went wrong. Promotion not created!`)

    // Close DB connection
    conn.close()

    return res.status(200).json({
      message: `Promotion '${title}' created successfully!`,
      doc
    })
  } catch (error) {
    console.log(error.message)
    next(error)
  }
}

export const editPromotion = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {

    // read from body
    const { _id, system, title, code, discount, status, startDate, endDate } = req.body

    const { model: Promotion, conn } = connection(system, 'Promotion', PromotionSchema)

    const doc = await Promotion.findOneAndUpdate({ _id },
      { title, code, discount, status, startDate, endDate})

      if(!doc) throw new BadRequest(`Something went wrong. Promotion not updated!`)

      // Close DB connection
    conn.close()

    return res.status(200).json({
      message: `Promotion updated successfully!`,
      doc
    })
  } catch (error) {
    console.log(error.message)
    next(error)
  }
}

export const deletePromotion = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    
    // read from body
    const { _id, system } = req.body

    const { model: Promotion, conn } = connection(system, 'Promotion', PromotionSchema)
    
    const doc = await Promotion.deleteOne({ _id })

    if(!doc) throw new BadRequest(`Something went wrong. Couldn't delete the promotion!`)

    // Close DB connection
    conn.close()

    return res.status(200).json({
      message: `Promotion deleted successfully!`,
      status: 'deleted',
      doc
    })
  } catch (error) {
    console.log(error.message)
    next(error)
  }
}


export const indexPromotions = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    // read from body
    const { system } = req.body

    const { model: Promotion, conn } = connection(system, 'Promotion', PromotionSchema)

    const doc = await Promotion.find()

    if(!doc) throw new NotFound(`Couldn't load the promotion. Refresh the page or contact support!`)

    // Close DB connection
    conn.close()

    return res.status(200).json({
      // message: `Promotion deled successfully!`,
      doc
    })
  } catch (error) {
    console.log(error.message)
    next(error)
  }
}
