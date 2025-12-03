import jwt from 'jsonwebtoken'
import { enviroment } from '../configurations/envirement'
import { Request, Response, NextFunction } from 'express'
import { errorFormat } from '../utils/errorFortmat'
import { ReqUser } from '../utils/req.user'
import { RedisUserRepository } from '../../modules/User/infrastructure/redis/RedisUserRepository'

export const rutaProtected = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token
  if (!token) throw new Error('Unauthorized')

  try {
    const payload = jwt.verify(token, enviroment.SECRET_JWT) as ReqUser
    const session = await RedisUserRepository.validateSession(payload.id_user, payload.email, token)
    if (!session) throw new Error('Unauthorized')
    req.user = payload
    next()
  } catch (error) {
    res.status(401).json({
      message: 'Unauthorized',
      error: errorFormat(error)
    })
  }
}
