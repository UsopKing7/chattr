import { PrismaClient } from '@prisma/client'
import { errorFormat } from '../utils/errorFortmat'

export const prisma = new PrismaClient()

export const prismaConnection = async () => {
  try {
    await prisma.$connect()
    console.log('[+][PRISMA] Conectado a la base de datos')
  } catch (error) {
    console.log('[-][PRISMA] No se pudo conectar a la base de datos', errorFormat(error))
  }
}

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})
