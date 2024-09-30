import { PostRepository } from '@domain/services/repositories/PostRepository'

export class DynamoDBCreatePostRepository implements PostRepository {
  createPost (postData: object): Promise<string> {
    throw new Error('Method not implemented.')
  }
  getAllPost (username: string): Promise<string> {
    throw new Error('Method not implemented.')
  }
  
}