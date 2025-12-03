import { Request, Response, NextFunction } from 'express'

export const responseMiddleware = async (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = res.statusCode !== 200 ? res.statusCode : 400
  const message = error.message || 'Internal Server Error'
  return res.status(status).json({
    status,
    sucess: false,
    message,
    timestamp: new Date().toISOString()
  })
}