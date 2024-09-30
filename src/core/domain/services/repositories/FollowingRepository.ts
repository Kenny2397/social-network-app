import { Follower } from '@domain/models/Follower'

export interface FollowingRepository {
  getFollowingListByUsername(username: string): Promise<Follower[]>
}