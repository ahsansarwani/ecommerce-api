//@ts-nocheck
import { Request, Response, NextFunction } from 'express'
import AddonSchema from '../../models/admin/Addon'
import { connection } from '../../database/connections'
import { BadRequest, NotFound } from '../../utils/error'

export const createAddon = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    //read from body
    const { name, price, status, system } = req.body

    const { model: Addon, conn } = connection(system, 'Addon', AddonSchema)

    const doc = await Addon.create({ name, price, status })

    if(!doc) throw new NotFound(`Something went wrong. Couldn't create addon!`)

    // Close DB connection
    conn.close()

    return res.status(200).json({
      message: `Addon '${name}' created successfully!`,
      doc
    })
  } catch (error) {
    console.log(error.message)
    next(error)
  }
}

export const editAddon = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    // read from body
    const { id, name, price, status, system } = req.body

    const { model: Addon, conn } = connection(system, 'Addon', AddonSchema)

    const doc = await Addon.findOneAndUpdate(
      { _id: id },
      { name, price, status })

    if(!doc) throw new BadRequest(`Something went wrong. Couldn't edit addon!`)

    // Close DB connection
    conn.close()

    return res.status(200).json({
      message: `Addon updated successfully!`,
      doc
    })
  } catch (error) {
    console.log(error.message)
    next(error)
  }
}

export const deleteAddon = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    // read from body
    const { id, system } = req.body

    const { model: Addon, conn } = connection(system, 'Addon', AddonSchema)

    const doc = await Addon.deleteOne({ _id: id })

    if(!doc) throw new BadRequest(`Something went wrong. Couldn't delete the addon!`)

    // Close DB connection
    conn.close()

    return res.status(200).json({
      message: `Addon deleted successfully!`,
      doc
    })
  } catch (error) {
    console.log(error.message)
    next(error)
  }
}

export const indexAddons = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    // read from body
    const { system } = req.body

    const { model: Addon, conn } = connection(system, 'Addon', AddonSchema)
    const doc = await Addon.find()

    if(!doc) throw new NotFound(`Couldn't load the addons. Refresh the page or contact support!`)

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

export const getAddons = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    // read from body
    const { system, addons } = req.body

    console.log(addons);

    const { model: Addon, conn } = connection(system, 'Addon', AddonSchema)
    const doc = await Addon.find({ name: { $in: addons } })

    if(!doc) throw new NotFound(`Addon(s) not found!`)

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
