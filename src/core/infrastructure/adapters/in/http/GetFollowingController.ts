import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { Handler } from 'src/core/app/ports/in/http/handler'
import { GetFollowingUsecase } from 'src/core/app/usecases/GetFollowingUsecase'
import { logger } from 'src/powertools/utilities'

export class GetFollowingController implements Handler<APIGatewayProxyEvent, Partial<Context>> {

  constructor (
    private readonly getFollowingUsecase: GetFollowingUsecase
  ) {}

  async exec (event: APIGatewayProxyEvent) {
    try {
      const username = (event.path as unknown as { username: string }).username
      logger.info(`Getting a list of followings of username: ${username}`)
      const response = await this.getFollowingUsecase.GetFollowingList(username)
      
      return response
    } catch (error) {
      return {
        statusCode: 500,
        body: { message: (error as Error).message }
      }
    }
  }
}