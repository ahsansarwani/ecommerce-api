// @ts-nocheck
import * as dotenv from 'dotenv'
import express, { Application } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
// import { json } from 'body-parser'
import { router } from './src/routes/router'
import { handleErrors } from './src/middleware/errorHandler'

dotenv.config()
const app: Application = express()

// Middleware
app.use(helmet())
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:8080', 'https://alivebc.netlify.app'],
  })
)
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)

app.all('*', (req, res, next)=> {
  const error = new Error(`Requested URL ${req.path} not found!`)
  error.statusCode = 404;
  next(error)
})

app.use(handleErrors)

if (!process.env.PORT) {
  process.exit(1)
}

console.log(process.env.PORT);
// Server Listening
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server is online @ port: ${process.env.PORT}`)
})
