import { User } from '@domain/models/User'
import { UserRepository } from '@domain/services/repositories/UserRepository'

export class GetUserUsecase {
  constructor (
    private readonly userRepository: UserRepository
  ) {}

  async GetUser (username: string): Promise<User> {
    return this.userRepository.getUserData(username)
  }
}