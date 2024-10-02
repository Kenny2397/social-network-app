import { PostRepository } from '@domain/services/repositories/PostRepository'
import { UserRepository } from '@domain/services/repositories/UserRepository'
import { GenerateError } from 'src/powertools/utilities'
import { CreatePostType } from '../schemas/PostSchema'

export class CreatePostUsecase {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository
  ) {}

  async createPost (postData: CreatePostType): Promise<string> {

    const user = await this.userRepository.getUserData(postData.username)
    if (!user) throw new GenerateError(404, { detail: 'User not found' })
    
    return await this.postRepository.createPost(postData)
  }
}