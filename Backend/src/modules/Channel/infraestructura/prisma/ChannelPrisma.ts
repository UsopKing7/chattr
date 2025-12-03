import { Channel } from '../../../../core/entities/Channel'
import { RoleType } from '../../../../core/enums/RoleType'
import { IChannelRepository } from '../../../../core/interfaces/IChannelRepository'
import { NameOV } from '../../../../core/value-objects/NameOV'
import { prisma } from '../../../../shared/configurations/db'

export class ChannelPrisma implements IChannelRepository {
  async create(data: Channel): Promise<Channel> {
    const created = await prisma.$transaction(async prisma => {
      const user = await prisma.user.findFirst({
        where: { id_user: data.id_user_owner, isOnline: true }
      })

      if (!user) throw new Error('User not found')

      const channel = await prisma.channel.create({
        data: {
          name: data.name.value,
          description: data.description,
          id_user_owner: user.id_user
        }
      })

      const role = await prisma.role.findFirst({
        where: { name: RoleType.PROPIETARIO },
        select: { id_rol: true }
      })

      if (!role) throw new Error('Role not found')

      await prisma.userRole.create({
        data: {
          id_user: created.id_user_owner,
          id_rol: role.id_rol
        }
      })

      return channel
    })

    return new Channel(
      new NameOV(created.name),
      created.description as string,
      created.id_user_owner,
      created.id_channel
    )
  }

  async findByName(name: string): Promise<Channel | null> {
    const channel = await prisma.channel.findUnique({
      where: { name }
    })

    if (!channel) return null

    return new Channel(
      new NameOV(channel.name),
      channel.description as string,
      channel.id_user_owner,
      channel.id_channel
    )
  }
}
