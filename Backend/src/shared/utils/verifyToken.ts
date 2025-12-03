import jwt from 'jsonwebtoken'
import { enviroment } from '../configurations/envirement'

export const verifyToken = (token: string) => {
  return jwt.verify(token, enviroment.SECRET_JWT) as { id_user: string; email: string }
}
