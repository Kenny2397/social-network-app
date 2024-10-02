import { Post } from '@domain/models/Post'
import { PostRepository } from '@domain/services/repositories/PostRepository'
import { GenerateError } from 'src/powertools/utilities'

export class GetAllPostUsecase {
  constructor (
    private readonly postRepository: PostRepository
  ) {}

  async GetAllPostList (username: string): Promise<Post[]> {
    
    const post = await this.postRepository.getAllPost(username)
    if (!post) throw new GenerateError(404, { detail: 'User without post' })
      
    return post
  }
}