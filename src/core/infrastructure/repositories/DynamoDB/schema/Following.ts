import { QueryCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { config } from '@config/environment'
import { Follower } from '@domain/models/Follower'
import { SetFollowerType } from 'src/core/app/schemas/FollowerSchema'
import { logger } from 'src/powertools/utilities'
import { getClient } from './Client'
import { Item } from './Item'

export class FollowingDynamoDB extends Item {
  followingUsername: string
  followedUsername: string

  constructor (followerData: Partial<SetFollowerType>) {
    super()
    this.followingUsername = followerData.followingUsername! 
    this.followedUsername = followerData.followedUsername ?? ''
  }

  get pk (): string {
    return `USER#${this.followingUsername}#FOLLOWING`
  }
  get sk (): string {
    return `USER#${this.followedUsername}`
  }
  
  static async getFollowingListByUsername (username: string) {
    const client = getClient()
    const following = new FollowingDynamoDB({ followingUsername: username })
    const command = new QueryCommand({
      TableName: config.socialNetworkTableName,
      KeyConditionExpression: 'PK = :username',
      ExpressionAttributeValues: {
        ':username': { 'S': following.pk }
      }
    })

    const response = await client.send(command)
    logger.info('getFollowingListByUsername : command - response', {
      command,
      response
    })
    const res = response.Items?.map(item => {
      const itemJson = unmarshall(item)
      return {
        username: itemJson.username as string,
        followedAt: itemJson.followedAt as string
      }
    })
    logger.info('getFollowerListByUsername', { res })
    return res as Follower[]
  }
}