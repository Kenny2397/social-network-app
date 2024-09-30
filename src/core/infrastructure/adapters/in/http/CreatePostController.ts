import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { Handler } from 'src/core/app/ports/in/http/handler'
import { SetFollowerSchema } from 'src/core/app/schemas/FollowerSchema'
import { CreatePostUsecase } from 'src/core/app/usecases/CreatePostUsecase'

export class CreatePostController implements Handler<APIGatewayProxyEvent, Partial<Context>> {

  constructor (
    private readonly createPostUsecase: CreatePostUsecase
  ) {}

  async exec (event: APIGatewayProxyEvent) {
    try {
      const eventBody = event.body
      const postInput = SetFollowerSchema.parse(eventBody)

      const response = await this.createPostUsecase.setPost(postInput)
      
      return response
    } catch (error) {
      return {
        statusCode: 500,
        body: { message: (error as Error).message }
      }
    }
  }
}