//@ts-nocheck
import { Request, Response, NextFunction } from 'express'
import ItemSchema from '../../models/admin/Item'
import { connection } from '../../database/connections'
import { BadRequest, NotFound } from '../../utils/error'

export const createItem = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    // read from body
    const { system, name, categories, addons, price, quantity, description, images, downloadURL, ingredients, brand, tax, status } = req.body
    const { model: Item, conn } = connection(system, 'Item', ItemSchema)

    const doc = await Item.create({ name, categories, addons, price, quantity, description, images, downloadURL, ingredients, brand, tax, status })

    if(!doc) throw new NotFound(`Something went wrong. Item not created!`)

    // Close DB connection
    conn.close()

    return res.status(200).json({
      message: `Item '${name}' created successfully!`,
      doc
    })
  } catch (error) {
    console.log(error.message)
    next(error)
  }
}

export const editItem = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    // console.log(req.body);
    // read from body
    const { _id, system, name, categories, addons, price, quantity, description, images, downloadURL, ingredients, brand, tax, status } = req.body
    const { model: Item, conn } = connection(system, 'Item', ItemSchema)

    const doc = await Item.findOneAndUpdate(
      { _id },
      { name, categories, addons, price, quantity, description, images, downloadURL, ingredients, brand, tax, status },
      { new: true }
    )

    if(!doc) throw new BadRequest(`Something went wrong. Item not updated!`)

    // Close DB connection
    conn.close()

    return res.status(200).json({
      message: `Item updated successfully!`,
      doc
    })
  } catch (error) {
    console.log(error.message)
    next(error)
  }
}

export const deleteItem = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    // read from body
    const { _id, system } = req.body
    const { model: Item, conn } = connection(system, 'Item', ItemSchema)

    const doc = await Item.deleteOne({ _id })

    if(!doc) throw new BadRequest(`Something went wrong. Couldn't delete the item!`)

     // Close DB connection
     conn.close()

    return res.status(200).json({
      message: `Item deleted successfully!`,
      status: 'deleted',
      doc
    })
  } catch (error) {
    console.log(error.message)
    next(error)
  }
}

export const indexItems = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    // read from body
    const { system } = req.body
    const { model: Item, conn } = connection(system, 'Item', ItemSchema)

    const doc = await Item.find({})

    if(!doc) throw new NotFound(`Couldn't load the items. Refresh the page or contact support!`)

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

export const getSingleItem = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    // read from body
    const { system} = req.body
    const _id = req.params.id
    const { model: Item, conn } = connection(system, 'Item', ItemSchema)

    const doc = await Item.findById({ _id })

    if(!doc) throw new NotFound(`Item not found.`)

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
