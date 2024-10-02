import { Post } from '@domain/models/Post'
import { CreatePostType } from 'src/core/app/schemas/PostSchema'

export interface PostRepository {
  createPost(postData: CreatePostType): Promise<string>
  getAllPost(username: string): Promise<Post[] | undefined>
}