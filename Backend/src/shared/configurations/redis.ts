import { createClient } from 'redis'
import { enviroment } from './envirement'
import { errorFormat } from '../utils/errorFortmat'

export const redis = createClient({
  url: enviroment.URL_REDIS
})

redis.on('connect', () => {
  console.log('[OK][REDIS] Database connected')
})

redis.on('error', (error) => {
  const err = errorFormat(error)
  console.log('[ERROR][REDIS] ', err)
})

export const redisConnection = async () => {
  try {
    await redis.connect()
  } catch {}
}

process.on('SIGINT', async () => {
  try {
    await redis.disconnect()
    console.log('[OK][REDIS] Database disconnected')
    process.exit(0)
  } catch (error) {
    const err = errorFormat(error)
    console.log(`[ERROR][REDIS] ${err}`)
    process.exit(1)
  }
})