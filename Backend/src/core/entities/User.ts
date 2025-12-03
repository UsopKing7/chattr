import { EmailVO } from '../value-objects/EmailOV'
import { PasswordVO } from '../value-objects/PasswordVO'
import { UsernameOV } from '../value-objects/UsernameOV'
import { Role } from './Role'

export class User {
  public roles: Role[] = []
  public isOnline: boolean = true

  constructor(
    public username: UsernameOV,
    public email: EmailVO,
    private password: PasswordVO,
    public readonly id_user?: string
  ) {}

  assignRole(role: Role) {
    if (!this.roles.find(r => r.getName === role.getName)) this.roles.push(role)
  }

  updateUsername(newUsername: UsernameOV) {
    this.username = newUsername
  }

  updateEmail(newEmail: EmailVO) {
    this.email = newEmail
  }

  async verifyPassword(password: string): Promise<boolean> {
    return this.password.compare(password)
  }

  get getPublicData() {
    return {
      id_user: this.id_user,
      username: this.username.value,
      email: this.email.value,
      isOnline: this.isOnline,
      roles: this.roles.map(role => role.getName())
    }
  }

  get passwordHash(): string {
    return this.password.value
  }
}
