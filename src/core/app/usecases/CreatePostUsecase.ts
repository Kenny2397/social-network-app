import { PostRepository } from '@domain/services/repositories/PostRepository'

export class CreatePostUsecase {
  constructor (
    private readonly PostRepository: PostRepository
  ) {}

  async setPost (postData: object): Promise<void> {
    await this.PostRepository.createPost(postData)
  }
}