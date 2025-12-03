import { Channel } from '../entities/Channel'

export interface IChannelRepository {
  create(data: Channel): Promise<Channel>
  findByName(name: string): Promise<Channel | null>
}
