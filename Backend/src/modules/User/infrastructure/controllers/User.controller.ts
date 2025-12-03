import { Request, Response } from 'express'
import { RegisterUserUseCase } from '../../application/use-case/User.usecase.'
import { PrismaUserRepository } from '../../infrastructure/prisma/PrismaUserRepository'
import { generateToken } from '../../../../shared/utils/generateToken'
import { RedisUserRepository } from '../redis/RedisUserRepository'
import { KEY } from '../../../../shared/configurations/keys'
import { verifyToken } from '../../../../shared/utils/verifyToken'

export class UserController {
  private userRepo = new PrismaUserRepository()
  private usecase = new RegisterUserUseCase(this.userRepo)

  async register(req: Request, res: Response) {
    await RedisUserRepository.delCache(KEY.users)
    const user = await this.usecase.create(req.body)
    return res.status(201).json({
      message: 'User created successfully',
      data: user.getPublicData
    })
  }

  async login(req: Request, res: Response) {
    const user = await this.usecase.login(req.body)
    const token = generateToken({ id_user: user.id_user as string, email: user.email.value })
    await RedisUserRepository.deleteSession(user.id_user as string, user.email.value)
    await RedisUserRepository.createSession(user.id_user as string, user.email.value, token)

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
      message: 'User logged in successfully',
      data: user.getPublicData
    })
  }

  async delete(req: Request, res: Response) {
    const id_userAuthenticated = req.user.id_user
    const { id_user } = req.params
    await this.usecase.deleteById(id_userAuthenticated, id_user)
    return res.status(200).json({
      message: 'User deleted successfully'
    })
  }

  async update(req: Request, res: Response) {
    const id_userAuthenticated = req.user.id_user
    const { id_user } = req.params
    await this.usecase.updateById(id_userAuthenticated, id_user, req.body)
    return res.status(200).json({
      message: 'User updated successfully'
    })
  }

  async allUsers(_req: Request, res: Response) {
    const users = await this.usecase.allUsersIsOnline()
    const data = users.map(user => user.getPublicData)
    await RedisUserRepository.setCache(KEY.users, data)
    return res.status(200).json({
      message: 'All users',
      data: data
    })
  }

  async logout(req: Request, res: Response) {
    const token = req.cookies.access_token
    const decoded = verifyToken(token)
    await RedisUserRepository.deleteSession(decoded.id_user, decoded.email)
    res.clearCookie('access_token')
    return res.status(200).json({
      message: 'User logged out successfully'
    })
  }
}
