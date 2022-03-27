//@ts-nocheck
import { Request, Response } from 'express'
import UserSchema from '../../models/User'
import { connection } from '../../database/connections'

export const createEmployeeAccount = async (req: Request, res: Response): Promise<object> => {
  
  // Read from body
  const { firstname, lastname, email, password, phone, role, bnkoDD } = req.body
  
  try {
    const Employee = connection(bnkoDD, 'Employee', UserSchema)
    const doc = await Employee.create({ firstname, lastname, email, password, phone, role })

    return res.status(200).json({
      message: `Account has been created successfully!`,
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
export const editEmployeeAccount = async (req: Request, res: Response): Promise<object> => {
  
  // Read from body
  const { id, firstname, lastname, email, password, phone, role, bnkoDD } = req.body
  
  try {
    const Employee = connection(bnkoDD, 'Employee', UserSchema)
    const doc = await Employee.findOneAndUpdate(
      { _id: id },
      { firstname, lastname, email, password, phone, role })

    return res.status(200).json({
      message: `Changes applied successfully!`,
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
export const deleteEmployeeAccount = async (req: Request, res: Response): Promise<object> => {
  
  // Read from body
  const { id, bnkoDD } = req.body
  
  try {
    const Employee = connection(bnkoDD, 'Employee', UserSchema)
    const doc = await Employee.deleteOne({ _id: id })

    return res.status(200).json({
      message: `Account has been deleted successfully!`,
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