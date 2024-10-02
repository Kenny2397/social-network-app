import { UserRepository } from '@domain/services/repositories/UserRepository'
import { CreateUserType } from '../schemas/UserSchema'

export class CreateUserUsecase {
  constructor (
    private readonly userRepository: UserRepository
  ) {}

  async CreateUser (userData: CreateUserType): Promise<string> {
    return await this.userRepository.createUser(userData)
  }
}