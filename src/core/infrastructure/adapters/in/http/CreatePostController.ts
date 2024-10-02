import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { Handler } from 'src/core/app/ports/in/http/handler'
import { CreatePostSchema, CreatePostType } from 'src/core/app/schemas/PostSchema'
import { CreatePostUsecase } from 'src/core/app/usecases/CreatePostUsecase'
import { responseHandler } from 'src/powertools/utilities'

export class CreatePostController implements Handler<APIGatewayProxyEvent, Partial<Context>> {

  constructor (
    private readonly createPostUsecase: CreatePostUsecase
  ) {}

  async exec (event: APIGatewayProxyEvent) {
    try {
      const eventBody = event.body
      const postInput: CreatePostType = CreatePostSchema.parse(eventBody)

      const response = await this.createPostUsecase.createPost(postInput)
      
      return responseHandler(200, {
        postId: response
      })
    } catch (error) {
      return responseHandler(500, null, error as Error)
    }
  }
}