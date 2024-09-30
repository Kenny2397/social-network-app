import { PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { config } from '@config/environment'
import { User } from '@domain/models/User'
import { CreateUserType } from 'src/core/app/schemas/UserSchema'
import { logger } from 'src/powertools/utilities'
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

  public keysInfo () {
    return {
      PK: { S: this.pk },
      SK: { S: this.skInfo }
    }
  }

  static toUserDomain (user: Record<string, unknown>): User {
    return  {
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      birthDate: user.birthDate,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
    } as User
  }

  static async createUserInfo (userData: CreateUserType) {
    const client = getClient()

    const user = new UserDynamoDB(userData.username)
    
    try {
      const command = new PutItemCommand({
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
      })
  
      const response = await client.send(command)
      logger.info('createUserInfo - response', { response })
    
      if (response.$metadata.httpStatusCode !== 200) {
        throw new Error('Error creating user')
      }
    
      return userData.username
    } catch (error) {
      logger.error('createUserInfo - error', { error })
      throw new Error('Error creating user')
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
  
    const response = await client.send(command)
    logger.info('getUser - response', {
      command,
      response
    })
    const userRaw = unmarshall(response.Items![0]!)

    return this.toUserDomain(userRaw)
  }
}