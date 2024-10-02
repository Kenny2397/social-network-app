import { Post } from '@domain/models/Post'
import { PostRepository } from '@domain/services/repositories/PostRepository'
import { CreatePostType } from 'src/core/app/schemas/PostSchema'
import { PostDynamoDB } from './schema/Post'

export class DynamoDBPostRepository implements PostRepository {
  async createPost (postData: CreatePostType): Promise<string> {
    const postId = await PostDynamoDB.createPost(postData)
    return postId
  }
  async getAllPost (username: string): Promise<Post[] | undefined> {
    const posts = await PostDynamoDB.getAllPosts(username)
    return posts
  }
}