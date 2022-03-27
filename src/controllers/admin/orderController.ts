//@ts-nocheck
import { Request, Response, NextFunction } from 'express'
import OrderSchema from '../../models/Order'
import { connection } from '../../database/connections'
import { BadRequest, NotFound } from '../../utils/error'

export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    //read from body
    const { system } = req.body
    
    const { model: Order, conn} = connection(system, 'Order', OrderSchema)
    
    const doc = await Order.create({ name, downloadURL, filename, status })
    
    if(!doc) throw new NotFound(`Something went wrong. Couldn't create order!`)

    // Close DB connection
    conn.close()

    return res.status(201).send({
      created: true,
      message: `Order created successfully!`,
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

export const editOrder = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    const { system, id: _id, name, phone, email, orderType, orderTotal, taxAmount, address, promoCode, deliveryOrPickupDate, deliveryOrPickupTime, orderNotes, orderDetails } = req.body
    
    const { model: Order, conn } = connection(system, 'Order', OrderSchema)

    const doc = await Order.findOneAndUpdate(
      { _id },
      { name, phone, email, orderType, orderTotal, taxAmount, address, promoCode, deliveryOrPickupDate, deliveryOrPickupTime, orderNotes, orderDetails },
      { new: true }
    )

    if(!doc) throw new NotFound(`Something went wrong. Couldn't update order!`)
    
    // // Close DB connection
    conn.close()

    return res.status(200).json({
      message: `Order updated successfully!`,
      doc
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const changeOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    const { system, _id, orderStatus, refundType, notes, amount } = req.body
    
    const { model: Order, conn } = connection(system, 'Order', OrderSchema)

    const doc = await Order.findById({ _id })

    if(!doc) throw new NotFound(`Something went wrong. Couldn't change order status!`)

    doc.orderStatus = orderStatus

    if (refundType) {
      doc.refund.type = refundType
      doc.refund.amount = amount
      doc.refund.notes = notes

      doc.markModified('refund')
      await doc.save()
    }    
    // Close DB connection
    conn.close()

    return res.status(200).json({
      message: `Order status changed successfully!`,
      doc
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const deleteOrder = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    const { system, id: _id } = req.body
    
    const { model: Order, conn } = connection(system, 'Order', OrderSchema)

    const doc = await Order.findOneAndDelete({ _id })

    if(!doc) throw new NotFound(`Something went wrong. Couldn't delete the order!`)

    const newArray = await Order.find()
    
    // // Close DB connection
    conn.close()

    return res.status(200).json({
      message: `Order deleted successfully!`,
      doc: newArray
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const indexOrders =  async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    // Read from body
    const { system } = req.body

    const { model: Order, conn } = connection(system, 'Order', OrderSchema)

    const doc = await Order.find(null, null, {
      limit: parseInt(req.query.limit) || '',
      // skip: 10
    })

    if(!doc) throw new NotFound(`Couldn't load the orders. Refresh the page or contact support!`)

    const totalDocs = await Order.estimatedDocumentCount()

    // Close DB connection
    conn.close()

    return res.status(200).json({ 
      doc,
      totalDocs
    })
  } catch(error) {
    next(error)
  }
}