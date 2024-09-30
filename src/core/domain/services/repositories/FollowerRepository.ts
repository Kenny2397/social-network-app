import { Follower } from '@domain/models/Follower'
import { SetFollowerType } from 'src/core/app/schemas/FollowerSchema'

export interface FollowerRepository {
  setFollower(followInput: SetFollowerType): Promise<string>
  getFollowerListByUsername(username: string): Promise<Follower[]>
}