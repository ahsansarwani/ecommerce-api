// @ts-nocheck
import { request, Request, Response } from 'express'
import { object } from 'joi'
// import FileUploadSchema  from '../../models/admin/FileUpload'
import mongoose from 'mongoose'
import Grid from 'gridfs-stream'


export const fileUpload = async (req: Request, res: Response): Promise<object> => {
  // console.log(req)
  // // read from body
  // const { name, description, system } = req.body
  // // const File = connection(system, 'File', FileUploadSchema)

  // try {
  //   const doc = await File.create({ name, description })
  //   return res.status(200).json({
  //     message: `Uploaded successfully!`,
  //     doc
  //   })
  // } catch (error) {
  //   return res.status(400).json({
  //     status: res.statusCode,
  //     error: error,
  //     message: error.message,
  //   })
  // }
}

export const editItem = async (req: Request, res: Response): Promise<object> => {
  // read from body
  const { id, name, category, price, description, image, ingredients, brand, system } = req.body
  const Item = connection(system, 'Item', ItemSchema)

  try {
    const doc = await Item.findOneAndUpdate(
      { _id: id },
      { name, category, price, description, image, ingredients, brand },
      { new: true }
    )
    return res.status(200).json({
      message: `Item updated successfully!`,
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

export const deleteItem = async (req: Request, res: Response): Promise<object> => {
  // read from body
  const { id, system } = req.body
  const Item = connection(system, 'Item', ItemSchema)

  try {
    const doc = await Item.deleteOne({ _id: id })
    return res.status(200).json({
      message: `Item deleted successfully!`,
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