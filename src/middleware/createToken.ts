//@ts-nocheck

import jwt from 'jsonwebtoken'

export const maxAgePasswordReset = '1h'
export const maxAgeCookie = 3 * 24 * 60 * 60 * 1000 // 3 days
export const maxAgeJWTToken = 3 * 24 * 60 * 60 *1000 // 3 days

export const createToken = (id: any, maxAge: any = maxAgeJWTToken ) => {
  const jwtSecretKey: string = process.env.ADMIN_JWT_TOKEN || 'admin_token_ecommerce'
  return jwt.sign({ id }, jwtSecretKey, { algorithm: 'HS256', expiresIn: maxAge })
}
