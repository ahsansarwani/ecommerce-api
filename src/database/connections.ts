//@ts-nocheck

import mongoose from 'mongoose'

export const connection = (system: string, modelName: string, schema) => {
  try {
    if (!system) throw "Error: missing system"
    const conn = mongoose.createConnection(`${process.env.DB_URI_FIRST_PART}${system}${process.env.DB_URI_LAST_PART}`, {
    // const conn = mongoose.createConnection(`${process.env.LOCAL_DB_URI_FIRST_PART}${system}${process.env.LOCAL_DB_URI_LAST_PART}` as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    mongoose.set('returnOriginal', false)
    const model = conn.model(modelName, schema)
    return { model, conn }
  } catch (error) {
    console.log(error)
  }
};