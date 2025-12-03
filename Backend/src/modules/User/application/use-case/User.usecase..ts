import { User } from '../../../../core/entities/User'
import { DomainError } from '../../../../core/errors/Domain.error'
import { IUserRepository } from '../../../../core/interfaces/IUserRepository'
import { EmailVO } from '../../../../core/value-objects/EmailOV'
import { PasswordVO } from '../../../../core/value-objects/PasswordVO'
import { UsernameOV } from '../../../../core/value-objects/UsernameOV'
import { UserDTO } from '../dtos/user.dto'

export class RegisterUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async create(data: UserDTO) {
    const username = new UsernameOV(data.username)
    const email = new EmailVO(data.email)
    const password = await PasswordVO.create(data.password)

    await this.ensureUsernameExists(username.value)
    await this.ensureEmailExists(email.value)

    const user = new User(username, email, password)
    return await this.userRepo.create(user)
  }

  async login(data: UserDTO) {
    const emailVO = new EmailVO(data.email)
    const user = await this.userRepo.findByEmail(emailVO.value)
    if (!user) throw new DomainError('User not found')

    const password = await user.verifyPassword(data.password)
    if (!password) throw new DomainError('Invalid password')

    return user
  }

  async deleteById(id_userAuthenticated: string, id_user: string): Promise<void> {
    await this.ensureUserPropietary(id_userAuthenticated, id_user)
    await this.userRepo.deleteById(id_user)
  }

  async updateById(id_userAuthenticated: string, id_user: string, data: UserDTO): Promise<void> {
    await this.ensureUserPropietary(id_userAuthenticated, id_user)
    const user = await this.userRepo.findById(id_user)
    if (!user) throw new DomainError('User not found')

    const newUsername = new UsernameOV(data.username)
    const newEemail = new EmailVO(data.email)

    await this.ensureUsernameNotTakenByOtherUser(newUsername.value, id_user)
    await this.ensureEmailNotTakenByOtherUser(newEemail.value, id_user)

    user.updateUsername(newUsername)
    user.updateEmail(newEemail)

    await this.userRepo.updateById(id_user, user)
  }

  async allUsersIsOnline(): Promise<User[]> {
    const users = await this.userRepo.allUsersIsOnline()
    if (!users) throw new DomainError('No users are online')
    return users
  }

  private async ensureUsernameExists(email: string) {
    const exists = await this.userRepo.findByEmail(email)
    if (exists) throw new DomainError('User already exists')
  }

  private async ensureEmailExists(email: string) {
    const exists = await this.userRepo.findByEmail(email)
    if (exists) throw new DomainError('Email already exists')
  }

  private async ensureUsernameNotTakenByOtherUser(username: string, id_user: string) {
    const user = await this.userRepo.findByUsername(username)
    if (user && user.id_user !== id_user) throw new DomainError('Username already taken by another user')
  }

  private async ensureEmailNotTakenByOtherUser(email: string, id_user: string) {
    const user = await this.userRepo.findByEmail(email)
    if (user && user.id_user !== id_user) throw new DomainError('Email already taken by another user')
  }

  private async ensureUserPropietary(id_userAuthenticated: string, id_user: string) {
    if (id_userAuthenticated !== id_user) throw new DomainError('You are not authorized to delete this user')
  }
}
