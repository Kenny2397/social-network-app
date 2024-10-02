import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { Handler } from 'src/core/app/ports/in/http/handler'
import { SetFollowerSchema, SetFollowerType } from 'src/core/app/schemas/FollowerSchema'
import { SetFollowerUsecase } from 'src/core/app/usecases/SetFollowerUsecase'
import { responseHandler } from 'src/powertools/utilities'

export class SetFollowerController implements Handler<APIGatewayProxyEvent, Partial<Context>> {

  constructor (
    private readonly setFollowerUsecase: SetFollowerUsecase
  ) {}

  async exec (event: APIGatewayProxyEvent) {
    try {
      const eventBody = event.body
      const followInput: SetFollowerType = SetFollowerSchema.parse(eventBody)

      const response = await this.setFollowerUsecase.setFollower(followInput)
      
      return responseHandler(200, {
        data: response
      })
    } catch (error) {
      return responseHandler(500, null, error as Error)
    }
  }
}