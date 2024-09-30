import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { Handler } from 'src/core/app/ports/in/http/handler'
import { SetFollowerSchema, SetFollowerType } from 'src/core/app/schemas/FollowerSchema'
import { SetFollowerUsecase } from 'src/core/app/usecases/SetFollowerUsecase'

export class SetFollowerController implements Handler<APIGatewayProxyEvent, Partial<Context>> {

  constructor (
    private readonly setFollowerUsecase: SetFollowerUsecase
  ) {}

  async exec (event: APIGatewayProxyEvent) {
    try {
      const eventBody = event.body
      const followInput: SetFollowerType = SetFollowerSchema.parse(eventBody)

      const response = await this.setFollowerUsecase.setFollower(followInput)
      
      return response
    } catch (error) {
      return {
        statusCode: 500,
        body: { message: (error as Error).message }
      }
    }
  }
}