import { Channel } from '../../../../core/entities/Channel'
import { DomainErrorChannel } from '../../../../core/errors/Domain.error'
import { IChannelRepository } from '../../../../core/interfaces/IChannelRepository'
import { NameOV } from '../../../../core/value-objects/NameOV'
import { ChannelDTO } from '../dto/channel.dto'

export class ChannelUseCase {
  constructor(private readonly channelRepo: IChannelRepository) {}

  async create(data: ChannelDTO) {
    const name = new NameOV(data.name)
    const description = data.description
    const id_user_owner = data.id_user_owner

    await this.ensureNameChannelExists(name.value)

    const channel = new Channel(name, description, id_user_owner)
    return await this.channelRepo.create(channel)
  }

  private async ensureNameChannelExists(name: string) {
    const channel = await this.channelRepo.findByName(name)
    if (channel) throw new DomainErrorChannel('Channel already exists')
  }
}
