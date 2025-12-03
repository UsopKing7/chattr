import bcrypt from 'bcrypt'
import { enviroment } from '../../shared/configurations/envirement'

export class PasswordVO {
  private constructor(private readonly hash: string) {}

  static async create(plain: string): Promise<PasswordVO> {
    if (plain.length < 8 ) throw new Error('Password must be at least 8 characters')

    const hash = await bcrypt.hash(plain, enviroment.SALT_ROUNDS)
    return new PasswordVO(hash)
  }

  static fromHash(hash: string): PasswordVO {
    return new PasswordVO(hash)
  }

  async compare(plain: string): Promise<boolean> {
    return bcrypt.compare(plain, this.hash)
  }

  get value(): string {
    return this.hash
  }
}