import { Role } from '../../../../core/entities/Role'
import { User } from '../../../../core/entities/User'
import { RoleType } from '../../../../core/enums/RoleType'
import { IUserRepository } from '../../../../core/interfaces/IUserRepository'
import { EmailVO } from '../../../../core/value-objects/EmailOV'
import { PasswordVO } from '../../../../core/value-objects/PasswordVO'
import { UsernameOV } from '../../../../core/value-objects/UsernameOV'
import { prisma } from '../../../../shared/configurations/db'

export class PrismaUserRepository implements IUserRepository {
  async create(data: User): Promise<User> {
    return await prisma.$transaction(async prisma => {
      const created = await prisma.user.create({
        data: {
          username: data.username.value,
          email: data.email.value,
          password: data.passwordHash,
          isOnline: data.isOnline
        }
      })

      return new User(
        new UsernameOV(created.username),
        new EmailVO(created.email),
        PasswordVO.fromHash(created.password),
        created.id_user
      )
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: { role: true }
        }
      }
    })

    if (!user) return null

    const found = new User(
      new UsernameOV(user.username),
      new EmailVO(user.email),
      PasswordVO.fromHash(user.password),
      user.id_user
    )

    found.roles = user.roles.map(ur => new Role(ur.role.name as RoleType, ur.role.id_rol))

    return found
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        roles: {
          include: { role: true }
        }
      }
    })

    if (!user) return null

    const found = new User(
      new UsernameOV(user.username),
      new EmailVO(user.email),
      PasswordVO.fromHash(user.password),
      user.id_user
    )

    found.roles = user.roles.map(ur => new Role(ur.role.name as RoleType, ur.role.id_rol))

    return found
  }

  async deleteById(id_user: string): Promise<void> {
    await prisma.user.delete({
      where: { id_user }
    })
  }

  async updateById(id_user: string, data: User): Promise<void> {
    await prisma.user.update({
      where: { id_user, isOnline: true },
      data: {
        username: data.username.value,
        email: data.email.value
      }
    })
  }

  async allUsersIsOnline(): Promise<User[]> {
    const users = await prisma.user.findMany({
      where: { isOnline: true },
      include: {
        roles: {
          include: { role: true }
        }
      }
    })

    return users.map(user => {
      const found = new User(
        new UsernameOV(user.username),
        new EmailVO(user.email),
        PasswordVO.fromHash(user.password),
        user.id_user
      )

      found.roles = user.roles.map(rol => {
        return new Role(rol.role.name as RoleType, rol.role.id_rol)
      })
      return found
    })
  }

  async findById(id_user: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id_user, isOnline: true }
    })

    if (!user) throw new Error('User not found')

    return new User(
      new UsernameOV(user.username),
      new EmailVO(user.email),
      PasswordVO.fromHash(user.password),
      user.id_user
    )
  }
}
