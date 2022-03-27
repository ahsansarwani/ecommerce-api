//@ts-nocheck
import { Response, Request, NextFunction } from 'express'
import UserSchema from '../models/User'
import OrderSchema from '../models/Order'
import SystemSchema from '../models/admin/System'
import { connection } from '../database/connections'
import { NotFound } from '../utils/error'
const mongoose = require('mongoose')
import { Nodemailer } from '../utils/nodemailer/index.js'

export const placeOrder = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    let idCreatedProgrammatically = false
    let { userId } = req.body
    if (!userId) {
      userId = new mongoose.Types.ObjectId()
      idCreatedProgrammatically = true
    }

    const {
      name, email, phone, system, orderTotal, paymentType, orderType, 
      orderDetails, address, promoCode, promoCodePercentage, discountAmount, tax, taxAmount, 
      deliveryCharge, orderNotes, deliveryOrPickupDate, deliveryOrPickupTime 
    } = req.body

    const { model: Order, conn } = connection(system, 'Order', OrderSchema)

    const doc = await Order.create({
      orderNumber: `${process.env.INVOICE_CODE}-${generateID(8)}`,
      name,
      userId,
      orderTotal,
      paymentType,
      orderType,
      orderDetails,
      email,
      phone,
      address,
      promoCode,
      promoCodePercentage,
      discountAmount,
      tax,
      taxAmount,
      deliveryCharge,
      orderNotes,
      orderFrom: process.env.ORDER_FROM,
      orderStatus: 0,
      isNotification: 0,
      deliveryOrPickupDate,
      deliveryOrPickupTime
    })
    
    // Link order to the user
    if (doc && userId && idCreatedProgrammatically === false) {
      const { model: User, conn } = connection(system, 'User', UserSchema)
      const user = await User.findById({ _id : userId })  
      user.orders.push(doc._id)
      user.markModified('orders')
      await user.save()
      conn.close()
    }

    sendOrderConfirmationEmail({
      email,
      system,
      name,
      orderNumber: doc.orderNumber
    })

    sendNewOrderEmailToAdmin({
      system,
      orderNumber: doc.orderNumber
    })

    // Close DB connection
    conn.close()

    return res.status(200).json({
      message: `Your order has been placed`,
      doc,
    })
  } catch (error) {
    console.log(error);
    next(error)
  }
}

export const getOrders = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    
    let { userId, system } = req.body

    const { model: User, conn } = connection(system, 'User', UserSchema)
    const user = await User.findById({ _id : userId })
    if (!user) throw new NotFound(`User not found!`)
  
    const { model: Order } = connection(system, 'Order', OrderSchema)
    const doc = await Order.find({ _id: { $in: user.orders } })
    
    // Close DB connection
    conn.close()

    return res.status(200).json({
      doc
    })
  } catch (error) {
    console.log(error);
    next(error)
  }
}

const generateID = (length: number) => {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result.toUpperCase();
}

const sendOrderConfirmationEmail = async (payload: any) => {
  const { email, system, name, orderNumber } = payload

  try {
    if (!email) throw 'Missing email'
    if (!system) throw 'Missing system'
    
    let nodeMailerResult
    const nodemailer = new Nodemailer(
      'qreativeweb.solutions', 
      465,
      {
        user: 'fos@qreativeweb.solutions',
        pass: '123#Difisil'
      }
    )

    nodeMailerResult = await nodemailer.sendEmail({
      from: "fos@qreativeweb.solutions",
      to: email,
      subject: "Your order details!",
      html: `
      <div>
        <h1>Order details</h1>
        <p> ${name}, thank you for your order. We are processing the order. You can view the details of the order below.</p>
        <p> Order-number: ${orderNumber} </p>
      </div>
      <p style="color: red;">HTML version of the message</p> <a href="` + '' + `">Reset password</a>
      `
    })

    if (nodeMailerResult.accepted.length === 0) {
      throw new Error('Something went wrong while sending e-mail to customer. Try again or contact support')
    }    
  } catch (error) {
    console.log(error)
  }
}

const sendNewOrderEmailToAdmin = async (payload: any) => {
  // Read from body
  const { system, orderNumber } = payload

  try {
    if (!system) throw 'Missing system'

    // Get system data
    const { model: System, conn } = connection(system, 'Systeminfo', SystemSchema)
    const systemData = await System.findOne({ system })
    
    let nodeMailerResult
    const nodemailer = new Nodemailer(
      'qreativeweb.solutions', 
      465,
      {
        user: 'fos@qreativeweb.solutions',
        pass: '123#Difisil'
      }
    )

    nodeMailerResult = await nodemailer.sendEmail({
      from: "fos@qreativeweb.solutions",
      to: systemData.businessEmail,
      subject: "New order details!",
      html: `
      <div>
        <h1>New order</h1>
        <p> There is a new order ready to be processed. </p>
        <p> Order-number: ${orderNumber} </p>
      </div>
      `
    })

    if (nodeMailerResult.accepted.length === 0) {
      // Close db connection
      conn.close()
      throw new Error('Something went wrong while sending e-mail to Admin. Try again or contact support')
    }

    // Close db connection
    conn.close()
    
  } catch (error) {
    console.log(error);
    // next(error)
  }
}