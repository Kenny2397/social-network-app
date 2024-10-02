import { Follower } from '@domain/models/Follower'
import { FollowingRepository } from '@domain/services/repositories/FollowingRepository'

export class GetFollowingUsecase {
  constructor (
    private readonly followingRepository: FollowingRepository
  ) {}

  async GetFollowingList (username: string): Promise<Follower[]> {
    return await this.followingRepository.getFollowingListByUsername(username)
  }
}