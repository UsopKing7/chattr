import { Request, Response } from 'express'
import { ChannelPrisma } from '../prisma/ChannelPrisma'
import { ChannelUseCase } from '../../application/use-case/Channel.usecase'
import { RedisChannel } from '../redis/RedisChannel'
import { KEY } from '../../../../shared/configurations/keys'

export class ChannelController {
  private channelRepo = new ChannelPrisma()
  private usecase = new ChannelUseCase(this.channelRepo)

  async create(req: Request, res: Response) {
    const { id_user_owner } = req.params
    await RedisChannel.delCache(KEY.channel)
    const channel = await this.usecase.create({ ...req.body, id_user_owner })
    return res.status(201).json({
      message: 'Channel creaded successfully',
      data: channel.getPublicData
    })
  }
}
