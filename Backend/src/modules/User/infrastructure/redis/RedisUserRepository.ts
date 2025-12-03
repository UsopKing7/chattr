import { RedisError } from "../../../../core/errors/Redis.error";
import { redis } from "../../../../shared/configurations/redis"; 

export class RedisUserRepository {
  static async getCache(key: string) {
    if (!key) throw new RedisError('Key is required')

    const data = await redis.get(key)
    if (!data) return null

    return JSON.parse(data)
  }

  static async setCache(key: string, data: unknown) {
    if (!key) throw new RedisError('Key is required')
    if (data === undefined) throw new RedisError('Data is required')

    const json = JSON.stringify(data)
    await redis.set(key, json)
  }

  static async delCache(key: string) {
    if (!key) throw new RedisError('Key is required')

    await Promise.all([
      redis.del(key)
    ])
  }

  static async createSession(id_user: string, email: string, token: string): Promise<void> {
    const key = `session:${id_user}:${email}`
    await redis.hSet(key, { id_user, email, token })
  }

  static async deleteSession(id_user: string, email: string) {
    const key = `session:${id_user}:${email}`
    await redis.del(key)
  }

  static async getSession(id_user: string, email: string): Promise<{ id_user: string, email: string, token: string } | null> {
    const key = `session:${id_user}:${email}`
    const token = await redis.hGetAll(key)
    if (!token || !token.token) return null
    return token as { id_user: string, email: string, token: string }
  }

  static async validateSession(id_user: string, email: string, token: string): Promise<boolean> {
    const storedToken = await this.getSession(id_user, email)
    if (!storedToken) return false
    return storedToken.token === token
  }
}
