import { User } from '@domain/models/User'
import { CreateUserType } from 'src/core/app/schemas/UserSchema'

export interface UserRepository {
  createUser(userData: CreateUserType): Promise<string>
  getUserData(username: string): Promise<User | undefined>
}