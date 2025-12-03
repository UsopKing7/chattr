import jwt from 'jsonwebtoken'
import { enviroment } from '../configurations/envirement'

export const generateToken = (payload: { id_user: string, email: string }) => {
  return jwt.sign(payload, enviroment.SECRET_JWT, { expiresIn: '7d' })
}
