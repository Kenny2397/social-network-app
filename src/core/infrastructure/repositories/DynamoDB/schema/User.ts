import { AttributeValue, QueryCommand, TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { config } from '@config/environment'
import { User, UserCount, UserInfo } from '@domain/models/User'
import { CreateUserType } from 'src/core/app/schemas/UserSchema'
import { GenerateError, logger } from 'src/powertools/utilities'
import { getClient } from './Client'
import { Item } from './Item'

export class UserDynamoDB extends Item {
  username: string

  constructor (username: string) {
    super()
    this.username = username
  }

  get pk () {
    return `USER#${this.username}`
  }
  get sk () {
    return `USER#${this.username}`
  }

  get skInfo () {
    return 'INFO'
  }

  get skCount () {
    return 'COUNT'
  }

  public keysInfo () {
    return {
      PK: { S: this.pk },
      SK: { S: this.skInfo }
    }
  }

  public keysCount () {
    return {
      PK: { S: this.pk },
      SK: { S: this.skCount }
    }
  }

  static fromQuery (items: Record<string, AttributeValue>[]) {
    const response = {
      count: {},
      info: {}
    } as User

    items.map(item => {
      const userdata = unmarshall(item)
      const SK = userdata.SK

      delete userdata.PK,
      delete userdata.SK

      if (SK === 'COUNT') {
        response.count = userdata as UserCount
      } else {
        response.info = userdata as UserInfo
      }
    })

    return response
  }

  static async createUserInfo (userData: CreateUserType) {
    const client = getClient()

    const user = new UserDynamoDB(userData.username)
    
    try {

      const command = new TransactWriteItemsCommand({
        TransactItems: [
          {
            Put: {
              TableName: config.socialNetworkTableName,
              Item: {
                ...user.keysInfo(),
                username: { S: userData.username },
                firstName: { S: userData.firstName },
                lastName: { S: userData.lastName },
                email: { S: userData.email },
                phone: { S: userData.phone },
                birthDate: { S: userData.birthDate },
                createdAt: { S: new Date().toISOString() },
                updatedAt: { S: new Date().toISOString() }
              },
              ConditionExpression: 'attribute_not_exists(PK)'
            }
          },
          {
            Put: {
              TableName: config.socialNetworkTableName,
              Item: {
                ...user.keysCount(),
                'follower': { N: '0' },
                'following': { N: '0' },
                'post': { N: '0' }
              },
              ConditionExpression: 'attribute_not_exists(PK)'
            }
          }
        ]
      }
      )
      
      const response = await client.send(command)
      logger.debug('createUserInfo : command - response', { command, response })
    
      return userData.username
    } catch (error) {
      logger.error('createUserInfo - error', { error })
      throw new GenerateError(400, { detail: 'User already exist' })
    }
  }

  static async getUser (username: string) {
    const client = getClient()
    const user = new UserDynamoDB(username)

    const command = new QueryCommand({
      TableName: config.socialNetworkTableName,
      KeyConditionExpression: 'PK = :username',
      ExpressionAttributeValues: {
        ':username': { S: user.pk }
      }
    })

    try {
      const response = await client.send(command)
      logger.debug('getUser - response', { command, response })

      if (response.Count === 0) {
        return undefined
      }

      return this.fromQuery(response.Items!)
    }
    catch (error) {
      logger.error('getUser - error', { error })
      throw new GenerateError(500, { detail: 'Error getting user' })
    }
  }
}