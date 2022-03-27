//@ts-nocheck
import { Request, Response, NextFunction } from 'express'
import { MongoClient } from 'mongodb'
const mongoose = require('mongoose')
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import SystemSchema from '../../models/admin/System'
import UserSchema from '../../models/User'
import { UserValidInfo } from '../validation/validation'
import { createToken, maxAgePasswordReset, maxAgeCookie } from '../../middleware/createToken'
import { connection } from '../../database/connections'
import { BadRequest, NotFound } from '../../utils/error'
import { Nodemailer } from '../../utils/nodemailer/index.js'

export const authAdminPage = async (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Only Auth Users watch this', 
  })
}

export const signUpAdmin = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  const _id = new mongoose.Types.ObjectId()
  try {
    // Read from body
    let {
      firstname,
      lastname,
      email,
      businessEmail,
      businessPhone,
      companyName,
      address,
      phone,
      businessCategory
    } = req.body
    
    // Generate database name for the system
    let system
    const modCompanyName = companyName.toLowerCase()
    modCompanyName.includes(' ') ? system = modCompanyName.split(' ').join('') : system = modCompanyName

    // Create database for the system (customer)
    const result = await createAccountDB((system).toLowerCase(), {
      system,
      ...req.body
    })

    if (result.type !== 'success') {
      // Remove database if error occurs during database creation
      // await SystemModel.findOneAndRemove({ _id: doc._id })
      throw `Something went wrong! Contact support. Code: db_setup_err`
    }

    const db = result.db

    // Encrypt the password
    const salt: string = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(req.body.password, salt)
    const role = 'admin'

    const count = await db.collection('users').countDocuments()
    const doc = await db.collection('users').insertOne({ _id, firstname, lastname, email, password, phone, role, system })

    // Create Token
    const token = createToken(doc._id)
    res.cookie('at_ecom', token, { httpOnly: true, maxAge: maxAgeCookie })

    return res.status(200).json({
      message: `Account and admin user for ${companyName} created successfully!`,
      admin: doc,
      token: token,
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const createAccountDB = async (system: string, payload: object) => {
  try {
    const URI = `${process.env.DB_URI_FIRST_PART}${system}${process.env.DB_URI_LAST_PART}`
    // const URI = process.env.MONGO_URI
    const client = await MongoClient.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    const db = client.db(system)

    db.createCollection('systeminfos')
    db.collection('systeminfos').insertOne({
      companyName: payload.companyName,
      address: payload.address,
      businessEmail: payload.businessEmail,
      businessPhone: payload.businessPhone,
      businessCategory: payload.businessCategory,
      system: payload.system,
      modules: []
    })
    db.createCollection('users')
    db.createCollection('sliders')
    db.createCollection('banners')
    db.createCollection('coupons')
    db.createCollection('items')
    db.createCollection('addons')
    db.createCollection('orders')
    db.createCollection('categories')
    db.createCollection('reviews')
    db.createCollection('reports')
    
    if (payload.businessCategory == 'restaurant') {
      db.createCollection('ingredients')
      db.createCollection('kitchen')
    }
    
    return {
      type: 'success',
      db
    }
  } catch (error)  {
    console.log(error)
    return {
      type: 'error',
      message: error
    }
  }
}

export const logInAdmin = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    const { system, email, password } = req.body
    const { model: User, conn } = connection(system, 'User', UserSchema)
    const { model: System } = connection(system, 'Systeminfo', SystemSchema)

    const doc: object = await User.findOne({ email })
    if (!doc) return res.status(404).json({ message: 'Profile doesn\'t exists. Check your email and/or password.' })

    const systemDoc: object = await System.findOne({ system: doc.system })
    if (!systemDoc) return res.status(404).json({ message: 'System not found...' })

    const comparePassword: boolean = await bcrypt.compare(password, doc.password)
    if (!comparePassword) return res.status(400).json({ message: 'Invalid email or password...' })

    // Create Token
    const token = createToken(doc._id)
    res.cookie('at_ecom', token, { httpOnly: true, maxAge: maxAgeCookie })

    // Close db connection
    conn.close()

    return res.status(200).json({
      message: `Welcome back ${doc.firstname}`,
      user: {
        _id: doc._id,
        firstname: doc.firstname,
        lastname: doc.lastname,
        email: doc.email,
        phone: doc.phone,
        role: doc.role,
        system: doc.system
      },
      system: systemDoc,
      token
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const getAdminSettingsData = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  // Read from body
  const { id, system } = req.body
  
  try {
    if (!id) throw "Missing ID"
    if (!system) throw "Missing System"

    const { model: User, conn } = connection(system as string, 'User', UserSchema)
    const { model: SystemModel } = connection(system as string, 'Systeminfo', SystemSchema)

    const user = await User.findById({ _id: id })

    let systemInfo
    if (user) systemInfo = await SystemModel.find({})

    // Close db connection
    conn.close()
   
    return res.status(200).json({ 
      user,
      systemInfo: systemInfo[0]
     })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const forgotAdminPassword = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  // Read from body
  const { email, system } = req.body
  
  try {
    if (!email) throw "Missing email"
    if (!system) throw "Missing system"

    const { model: User, conn } = connection(system as string, 'User', UserSchema)
    const doc = await User.findOne({ email })

    if(!doc) throw new NotFound(`E-mail address doesn't exist`)
    
    let nodeMailerResult
    if (doc.system == system) {
      const nodemailer = new Nodemailer(
        'qreativeweb.solutions', 
        465,
        {
          user: 'fos@qreativeweb.solutions',
          pass: '123#Difisil'
        }
      )
      const token = createToken(doc._id, '1h')
      const url = `http://${process.env.DOMAIN_NAME}/reset-password?tk=${token}&sys=${system}`

      nodeMailerResult = await nodemailer.sendEmail({
        from: "fos@qreativeweb.solutions",
        to: email,
        subject: "Reset password!",
        html: `<p style="color: red;">HTML version of the message</p> <a href="` + url + `">Reset password</a>`
      })
    }

    if (nodeMailerResult.accepted.length === 0) {
      // Close db connection
      conn.close()
      throw new Error('Something went wrong. Try again or contact support')
    }

    // Close db connection
    conn.close()
    
    return res.status(200).json({ 
      message: 'Please check your e-mail - we have sent a message with further instructions.'
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const resetAdminPassword = async (req: Request, res: Response, next: NextFunction): Promise<object> => { 
  // Read from body
  const { token, system } = req.params

  try {
    if (!system) throw 'Missing system'
    if (!token) throw 'Missing token'

    const decoded = jwt.verify(token, process.env.ADMIN_JWT_TOKEN)

    const { model: User, conn } = connection(system as string, 'User', UserSchema)
    const doc = await User.findById({ _id: decoded.id })

    if(!doc) throw new NotFound(`E-mail address doesn't exist`)

    const salt: string = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(req.body.password, salt)
    doc.password = password
    await doc.save()

    let nodeMailerResult
    if (doc.system == system) {
      const nodemailer = new Nodemailer(
        'qreativeweb.solutions', 
        465,
        {
          user: 'fos@qreativeweb.solutions',
          pass: '123#Difisil'
        }
      )
      
      const url = `http://${process.env.DOMAIN_NAME}/login`
      nodeMailerResult = await nodemailer.sendEmail({
        from: "fos@qreativeweb.solutions",
        to: doc.email,
        subject: "Password reset confirmation!",
        html: `<p style="color: red;">HTML version of the message</p> <a href="` + url + `">Login</a>` //TODO: confirm message
      })
    }

    if (nodeMailerResult.accepted.length === 0) {
      // Close db connection
      conn.close()
      throw new Error('Something went wrong. Try again or contact support')
    }

    // Close db connection
    conn.close()
    
    return res.status(200).json({ 
      message: 'Password saved successfully!',
      success: true
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const updateAdminSettingsData = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  // Read from body
  const { 
    id,
    companyName,
    businessPhone,
    address,
    currency, 
    deliveryCharge,
    tax,
    logo,
    favicon,
    facebook,
    twitter,
    instagram,
    snapchat,
    tiktok,
    termsConditions,
    privacyPolicy,
    about,
    system
  } = req.body
  
  try {
    if (!id) throw "Missing ID"
    const { model: SystemInfo, conn } = connection(system as string, 'Systeminfo', SystemSchema)

    const systemInfo = await SystemInfo.findOneAndUpdate(
      { system },
      { companyName, address, currency, deliveryCharge, tax, businessPhone, logo, favicon, facebook, twitter, instagram, snapchat, tiktok, termsConditions, privacyPolicy, about }
    )
   
    // Close db connection
    conn.close()
    
    return res.status(200).json({
      message: `Account settings updated!`,
      systemInfo: systemInfo
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const updateAdminAccountData = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  // Read from body
  const { id, firstname, lastname, email, phone, system } = req.body
  
  try {
    if (!id) throw "Missing ID"
    const { model: User, conn } = connection(system as string, 'User', UserSchema)

    // Encrypt the password
    const salt: string = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(req.body.password, salt)

    const user = await User.findOneAndUpdate(
      { _id: id },
      { firstname, lastname, email, phone, password }
    )
   
    // Close db connection
    conn.close()
    
    return res.status(200).json({
      message: `Account settings updated!`,
      user
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const logOutAdmin = (_req: Request, res: Response): object => {
  return res.clearCookie('at_ecom').status(200).json({
    status: res.status,
    logout: true,
    message: 'Successfully Log Out',
  })
}
