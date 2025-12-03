import { RedisUserRepository } from '../../modules/User/infrastructure/redis/RedisUserRepository'
import { Request, Response, NextFunction } from 'express'

export const cacheMiddleware = (keygenerator: (req: Request) => string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = keygenerator(req)
      const data = await RedisUserRepository.getCache(key)
      if (data) return res.status(200).json(data)
  
      res.locals.cachekey = key
      return next()
    } catch (error) {
      return next()
    }
  }
} 