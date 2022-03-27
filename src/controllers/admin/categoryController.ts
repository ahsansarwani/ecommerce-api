//@ts-nocheck
import { Request, Response, NextFunction } from 'express'
import CategorySchema from '../../models/admin/Category'
import { connection } from '../../database/connections'
import { BadRequest, NotFound } from '../../utils/error'

export const addCategory = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    //read from body
    const { name, system, downloadURL, filename, status } = req.body
    
    const { model: Category, conn} = connection(system, 'Category', CategorySchema)
    
    const doc = await Category.create({ name, downloadURL, filename, status })
    
    if(!doc) throw new NotFound(`Something went wrong. Couldn't create category!`)

    // Close DB connection
    conn.close()

    return res.status(201).send({
      created: true,
      message: `Category '${name}' created successfully!`,
      doc
    })  
  } catch(error) {
    if (error.code === 11000) {
      error.message = 'Category name already exist!'
    } else if (error.errors) {
      error.errors.name.properties.type === 'required'
      error.message = 'Category name is required!'
    }
    next(error)
  } 
}

export const editCategory = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    // read from body
    const { _id, name, system, downloadURL, filename, status } = req.body

    const { model: Category, conn } = connection(system, 'Category', CategorySchema)

    const doc = await Category.findOneAndUpdate(
      { _id },
      { name, downloadURL, filename, status })

    if(!doc) throw new BadRequest(`Something went wrong. Couldn't edit category!`)

    // Close DB connection
    conn.close()

    return res.status(200).json({
      edit: true,
      message: `Category updated successfully!`,
      doc
    })
  } catch(error) {
    console.log(error)
    next(error)
  } 
}

export const deleteCategory =  async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    // read from body
    const { id, system } = req.body

    if (!id) throw new BadRequest('Missing ID')

    const { model: Category, conn } = connection(system, 'Category', CategorySchema)

    await Category.deleteOne({ _id: id })

    const doc = await Category.find()

    if(!doc) throw new BadRequest(`Something went wrong. Couldn't delete the category!`)

    // Close DB connection
    conn.close()

    return res.status(200).json({
      message: `Category deleted successfully!`,
      status: 'deleted',
      doc
    })
  } catch(error) {
    next(error)
  }
}

export const indexCategories =  async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    // Read from body
    const { system } = req.body

    const { model: Category, conn } = connection(system, 'Category', CategorySchema)

    const doc = await Category.find()

    if(!doc) throw new NotFound(`Couldn't load the categories. Refresh the page or contact support!`)

    conn.close()

    return res.status(200).json({ doc })
  } catch(error) {
    next(error)
  }
}