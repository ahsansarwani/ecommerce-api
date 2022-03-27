//@ts-nocheck
import { Request, Response } from 'express'
import ReviewSchema from '../models/Review'
import { connection } from '../database/connections'

export const postReview = async (req: Request, res: Response): Promise<object> => {
  // read from body
  const { name, rating, comment, bnkoDD } = req.body
  const Review = connection(bnkoDD, 'Review', ReviewSchema)

  try {
    const doc = await Review.create({ name, rating, comment })

    return res.status(200).json({
      message: `Your review has been submitted successfully!`,
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