import { QueryCommand, TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { config } from '@config/environment'
import { Follower } from '@domain/models/Follower'
import { SetFollowerType } from 'src/core/app/schemas/FollowerSchema'
import { GenerateError, logger } from 'src/powertools/utilities'
import { getClient } from './Client'
import { FollowingDynamoDB } from './Following'
import { Item } from './Item'
import { UserDynamoDB } from './User'

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
    const userFollowed = new UserDynamoDB(follower.followedUsername)
    const userFollowing = new UserDynamoDB(follower.followingUsername)
    
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
          },
          {
            Update: {
              TableName: config.socialNetworkTableName,
              Key: userFollowed.keysCount(),
              UpdateExpression: 'ADD #followers :inc',
              ExpressionAttributeNames: {
                '#followers': 'follower#'
              },
              ExpressionAttributeValues: {
                ':inc': { N: '1' }
              }
            }
          },
          {
            Update: {
              TableName: config.socialNetworkTableName,
              Key: userFollowing.keysCount(),
              UpdateExpression: 'ADD #following :inc',
              ExpressionAttributeNames: {
                '#following': 'following#'
              },
              ExpressionAttributeValues: {
                ':inc': { N: '1' }
              }
            }
          }
        ]
      }
    )
    try {
      
      const response = await client.send(command)
      logger.info('set followers: command - response', {
        command,
        response
      })
      
      if (response.$metadata.httpStatusCode !== 200) {
        throw new GenerateError(500, { detail: 'Error setting follower' })
      }
      return 'ok'
    } catch (error) {
      throw new GenerateError(500, { detail: 'Error setting follower' })
    }
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