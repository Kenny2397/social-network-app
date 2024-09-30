import { FollowerRepository } from '@domain/services/repositories/FollowerRepository'
import { SetFollowerType } from '../schemas/FollowerSchema'

export class SetFollowerUsecase {
  constructor (
    private readonly followerRepository: FollowerRepository
  ) {}

  async setFollower (followerInput: SetFollowerType): Promise<void> {
    
    await this.followerRepository.setFollower(followerInput)
  }
}