import { AttributeValue, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { config } from '@config/environment'
import { Post } from '@domain/models/Post'
import { CreatePostType } from 'src/core/app/schemas/PostSchema'
import { GenerateError, logger } from 'src/powertools/utilities'
import { ulid } from 'ulid'
import { getClient } from './Client'
import { Item } from './Item'

export class PostDynamoDB extends Item {
  username: string
  id: string

  constructor (username: string) {
    super()
    this.username = username
    this.id = ulid()
  }

  get pk () {
    return `USER#${this.username}#POST`
  }
  get sk () {
    return `POST#${this.id}`
  }

  static fromQuery (items: Record<string, AttributeValue>[]) {
    // const response = {
    //   id: '',
    //   username: '',
    //   title: '',
    //   subtitle: '',
    //   content: '',
    //   imageUrl: ''
    // } as Post

    const response = items.map(item => {
      const postData = unmarshall(item)

      delete postData.PK,
      delete postData.SK
      return postData as Post
    })

    return response
  }

  static async createPost (postData: CreatePostType) {
    const client = getClient()

    const post = new PostDynamoDB(postData.username)

    const command = new PutItemCommand({
      TableName: config.socialNetworkTableName,
      Item: {
        ...post.keysValue(),
        id: { S: post.id },
        title: { S: postData.title },
        subtitle: { S: postData.subtitle },
        content: { S: postData.content },
        imageUrl: { S: postData.imageUrl },
        createdAt: { S: new Date().toISOString() },
        updatedAt: { S: new Date().toISOString() }
      }
    })
    try {
      const response = await client.send(command)
      logger.debug('createpost command - response', { command, response })

      return post.id
    } catch (error) {
      logger.error('createpost - error', { error })
      throw new GenerateError(500, { detail: 'Error creating post' })
    }
  }

  static async getAllPosts (username: string) {
    const client = getClient()
    const post = new PostDynamoDB(username)
    const command = new QueryCommand({
      TableName: config.socialNetworkTableName,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': { S: post.pk }
      },
      ScanIndexForward: false
    })
    try {
      const response = await client.send(command)
      logger.debug('getallposts command - response', { command, response })

      if (response.Count === 0) {
        return undefined
      }

      return this.fromQuery(response.Items!)
    } catch (error) {
      logger.error('getallposts - error', { error })
      throw new GenerateError(500, { detail: 'Error getting posts' })
    }
  }
}