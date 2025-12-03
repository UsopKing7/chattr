import { User } from '../entities/User'

export interface IUserRepository {
  create(data: User): Promise<User>
  findById(id_user: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
  deleteById(id_user: string): Promise<void>
  updateById(id_user: string, data: User): Promise<void>
  allUsersIsOnline(): Promise<User[]>
}
