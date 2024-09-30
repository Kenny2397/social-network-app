import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { Handler } from 'src/core/app/ports/in/http/handler'
import { GetFollowerUsecase } from 'src/core/app/usecases/GetFollowerUsecase'
import { logger } from 'src/powertools/utilities'

export class GetFollowerController implements Handler<APIGatewayProxyEvent, Partial<Context>> {

  constructor (
    private readonly getFollowerUsecase: GetFollowerUsecase
  ) {}

  async exec (event: APIGatewayProxyEvent) {
    try {
      const username = (event.path as unknown as { username: string }).username
      logger.info(`Getting a list of followers for username: ${username}`)
      const response = await this.getFollowerUsecase.GetFollowerList(username)
      
      return response
    } catch (error) {
      return {
        statusCode: 500,
        body: { message: (error as Error).message }
      }
    }
  }
}