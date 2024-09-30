import { Follower } from '@domain/models/Follower'
import { FollowerRepository } from '@domain/services/repositories/FollowerRepository'
import { SetFollowerType } from 'src/core/app/schemas/FollowerSchema'
import { FollowerDynamoDB } from './schema/Follower'
import { FollowingDynamoDB } from './schema/Following'

export class DynamoDBFollowerRepository implements FollowerRepository {

  async setFollower (followInput: SetFollowerType): Promise<string> {
    const res = await FollowerDynamoDB.setFollower(followInput)
    return res
  }

  async getFollowerListByUsername (username: string): Promise<Follower[]> {
    const followers = await FollowerDynamoDB.getFollowerListByUsername(username)
    return followers
  }

  async getFollowingListByUsername (username: string): Promise<Follower[]> {
    const followings = await FollowingDynamoDB.getFollowingListByUsername(username)
    return followings
  }
}