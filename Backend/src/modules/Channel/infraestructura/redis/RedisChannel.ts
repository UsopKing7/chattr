import { RedisError } from '../../../../core/errors/Redis.error'
import { redis } from '../../../../shared/configurations/redis'

export class RedisChannel {
  static async delCache(key: string) {
    if (!key) throw new RedisError('Key is required')

    await Promise.all([redis.del(key)])
  }
}
