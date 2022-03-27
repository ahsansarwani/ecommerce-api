//@ts-nocheck
import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import UserSchema from '../models/User'
import SystemSchema from '../models/admin/System'
// import { UserValidInfo } from '../validation/validation'
import { createToken, maxAgeJWTToken } from '../middleware/createToken'
import { connection } from '../database/connections'
import { BadRequest, NotFound } from '../utils/error'
// import { object } from 'joi'
const mongoose = require('mongoose')
import { Nodemailer } from '../utils/nodemailer/index.js'

// export const authPage = async (_req: Request, res: Response) => {
//   res.status(200).json({
//     message: 'Only Auth Users watch this',
//   })
// }

export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  // Validation User Input
  // const { error } = UserValidInfo.validate(req.body)
  // if (error) return res.status(400).json({ message: error.details[0].message })

  try {

    const _id = new mongoose.Types.ObjectId()

    // Read from body
    const { system, firstname, lastname, email, password } = req.body

    const { model: User, conn } = connection(system, 'User', UserSchema)

    // Create user
    const doc = await User.create({ _id, system, firstname, lastname, email, password })

    if(!doc) throw new NotFound(`Something went wrong. User not created!`)

    // Create Token
    const token = createToken(doc._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAgeJWTToken })

    // Encrypt the password
    const salt: string = await bcrypt.genSalt(10)
    doc.password = await bcrypt.hash(doc.password, salt)
    const docSaved = await doc.save()

    if (docSaved) {
      sendNewAccountConfirmationEmail({
        email,
        system,
        name: firstname + lastname
      })
    }

    // Close DB connection
    conn.close()

    return res.status(200).json({
      message: `Your account has been created successfully!`,
      doc,
      token: token,
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const logIn = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {

    // Read from body
    const { email, password, system } = req.body

    const { model: User, conn } = connection(system, 'User', UserSchema)

    const doc = await User.findOne({ email })
    
    if(!doc) throw new NotFound(`Something went wrong. User not found!`)

    const comparePassword: boolean = await bcrypt.compare(password, doc.password)
    if (!comparePassword) return res.status(400).json({ message: 'Invalid email or password' })

    // Get system data
    // const { model: System } = connection(system, 'Systeminfo', SystemSchema)
    // const systemData: object = await System.findOne({ system: doc.system })

    // Create Token
    const token = createToken(doc._id)
    res.cookie('at_ecom', token, { httpOnly: true, maxAge: maxAgeJWTToken })

    // Close DB connection
    conn.close()

    return res.status(200).json({
      message: `Hello ${doc.firstname} ${doc.lastname}!`,
      doc,
      // systemData,
      token: token,
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  // Validation User Input
  // const { error } = UserValidInfo.validate(req.body)
  // if (error) return res.status(400).json({ message: error.details[0].message })

  try {
    // Read from body
    const { email } = req.body

    const { model: User, conn } = connection('mainDB', 'Admin', SystemSchema)

    // Create user
    const doc = await User.findOne({ email: email })

    if(!doc) throw new NotFound(`Something went wrong. User not found!`)

    resetPasswordMail(doc.email)

    // Close DB connection
    conn.close()

    return res.status(200).json({
      message: `Please check your email address for instructions to reset your password.`,
      doc,
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const passwordResetCustomer = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    // Read from body
    const { system, email, url } = req.body

    const { model: User, conn } = connection(system, 'User', UserSchema)

    // Create user
    const doc = await User.findOne({ email: email })

    if(!doc) throw new NotFound(`Email address not found!`)

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
      to: doc.email,
      subject: "Password Reset!",
      html: `
      <div>
        <h1>Reset your password</h1>
        <p>To complete the reset password process, click on the link below: </p>
        <a href="${url}/account-reset?system=${doc.system}&email=${doc.email}&id=${doc._id}">Reset Password</a>
      </div>
      `
    })

    if (nodeMailerResult.accepted.length === 0) {
      // Close db connection
      conn.close()
      throw new Error('Something went wrong while sending e-mail. Try again or contact support')
    }

    // Close DB connection
    conn.close()

    return res.status(200).json({
      message: `Please check your e-mail inbox for a link to complete the reset.`
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const logOut = (_req: Request, res: Response): object => {
  return res.clearCookie('at_ecom').status(200).json({
    status: res.status,
    logout: true,
    message: 'See you soon!!!',
  })
}

export const editUser = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    // read from body
    const { _id, system, firstname, lastname, email, address, phone, password } = req.body

    const { model: User, conn } = connection(system, 'User', UserSchema)

    const doc = await User.findOneAndUpdate(
      { _id },
      { firstname, lastname, email, address, phone, password }
    )

    if (password) {
      // Encrypt the password
      const salt: string = await bcrypt.genSalt(10)
      doc.password = await bcrypt.hash(doc.password, salt)
      await doc.save()
    }

    if(!doc) throw new BadRequest(`Something went wrong. Profile not updated!`)

    // Close DB connection
    conn.close()

    return res.status(200).json({
      message: `Profile updated successfully!`,
      updated: true,
      doc
    })
  } catch (error) {
    console.log(error.message)
    next(error)
  }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    // read from body
    const { _id, system } = req.body
    const { model: User, conn } = connection(system, 'User', UserSchema)

    const doc = await User.deleteOne({ _id })

    if(!doc) throw new BadRequest(`Something went wrong. Couldn't delete the customer!`)

     // Close DB connection
     conn.close()

    return res.status(200).json({
      message: `User deleted successfully!`,
      status: 'deleted',
      doc
    })
  } catch (error) {
    console.log(error.message)
    next(error)
  }
}

export const getProfileData = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    // read from body
    const { system, _id } = req.body
    const { model: User, conn } = connection(system, 'User', UserSchema)

    const doc = await User.findById({ _id })

    if(!doc) throw new NotFound(`Couldn't load profile data. Refresh the page or contact support!`)

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

export const indexUsers = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    // read from body
    const { system } = req.body
    const { model: User, conn } = connection(system, 'User', UserSchema)

    const doc = await User.find({})

    if(!doc) throw new NotFound(`Couldn't load customers. Refresh the page or contact support!`)

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

export const getSystemData = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
  try {
    // read from body
    const { system } = req.body
    const { model: System, conn } = connection(system, 'Systeminfo', SystemSchema)

    const doc = await System.find({})

    if(!doc) throw new NotFound(`Couldn't load system data. Refresh the page or contact support!`)

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

const sendNewAccountConfirmationEmail = async (payload: any) => {
  const { email, system, name } = payload

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
      subject: "Registration Confirmation",
      html: `
      <div>
        <h1>Account registration</h1>
        <p> ${name}, your account has been created.</p>
      </div>
      `
    })

    if (nodeMailerResult.accepted.length === 0) {
      throw new Error('Something went wrong while sending e-mail to customer. Try again or contact support')
    }    
  } catch (error) {
    console.log(error)
  }
}