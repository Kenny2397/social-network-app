import { QueryCommand, TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { config } from '@config/environment'
import { Follower } from '@domain/models/Follower'
import { SetFollowerType } from 'src/core/app/schemas/FollowerSchema'
import { logger } from 'src/powertools/utilities'
import { getClient } from './Client'
import { FollowingDynamoDB } from './Following'
import { Item } from './Item'

export class FollowerDynamoDB extends Item {
  followedUsername: string
  followingUsername: string

  constructor (followerData: Partial<SetFollowerType>) {
    super()
    this.followedUsername = followerData.followedUsername!
    this.followingUsername = followerData.followingUsername ?? ''
  }

  get pk (): string {
    return `USER#${this.followedUsername}#FOLLOWER`
  }
  get sk (): string {
    return `USER#${this.followingUsername}`
  }
  
  static async setFollower (followerData: SetFollowerType): Promise<string> {
    const client = getClient()
    const follower = new FollowerDynamoDB(followerData)
    const following = new FollowingDynamoDB(followerData)
    
    const command = new TransactWriteItemsCommand(
      {
        TransactItems: [
          {
            Put: {
              TableName: config.socialNetworkTableName,
              Item: {
                ...follower.keysValue(),
                username: { S: follower.followingUsername },
                followedAt: { S: new Date().toISOString() }
              },
              ConditionExpression: 'attribute_not_exists(PK)'
            }
          },
          {
            Put: {
              TableName: config.socialNetworkTableName,
              Item: {
                ...following.keysValue(),
                username: { S: following.followedUsername },
                followedAt: { S: new Date().toISOString() }
              },
              ConditionExpression: 'attribute_not_exists(PK)'
            }
          }
        ]
      }
    )
    
    const response = await client.send(command)
    logger.info('set followers: command - response', {
      command,
      response
    })
  
    if (response.$metadata.httpStatusCode !== 200) {
      throw new Error('Error setting follower')
    }
    return 'ok'
  }
  
  static async getFollowerListByUsername (username: string) {
    const client = getClient()
    const follower = new FollowerDynamoDB({ followedUsername: username })
    const command = new QueryCommand({
      TableName: config.socialNetworkTableName,
      KeyConditionExpression: 'PK = :username',
      ExpressionAttributeValues: {
        ':username': { 'S': follower.pk }
      }
    })

    const response = await client.send(command)
    logger.info('getUser - response', {
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