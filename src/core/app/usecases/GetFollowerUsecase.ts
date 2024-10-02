import { Follower } from '@domain/models/Follower'
import { FollowerRepository } from '@domain/services/repositories/FollowerRepository'

export class GetFollowerUsecase {
  constructor (
    private readonly followerRepository: FollowerRepository
  ) {}

  async GetFollowerList (username: string): Promise<Follower[]> {
    return await this.followerRepository.getFollowerListByUsername(username)
  }
}