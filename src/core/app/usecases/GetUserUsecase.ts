import { User } from '@domain/models/User'
import { UserRepository } from '@domain/services/repositories/UserRepository'
import { GenerateError, logger } from 'src/powertools/utilities'

export class GetUserUsecase {
  constructor (
    private readonly userRepository: UserRepository
  ) {}

  async GetUser (username: string): Promise<User | undefined> {
    const user = await this.userRepository.getUserData(username)
    logger.debug('GetUserUsecase', { user })
    if (!user) throw new GenerateError(400, { detail: 'User not found' })
    
    return user
  }
}