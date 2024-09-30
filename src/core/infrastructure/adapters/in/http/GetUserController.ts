import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { Handler } from 'src/core/app/ports/in/http/handler'
import { GetUserUsecase } from 'src/core/app/usecases/GetUserUsecase'
import { logger } from 'src/powertools/utilities'

export class GetUserController implements Handler<APIGatewayProxyEvent, Partial<Context>> {

  constructor (
    private readonly getUserUsecase: GetUserUsecase 
  ) {}

  async exec (event: APIGatewayProxyEvent) {
    try {
      const username = (event.path as unknown as { username: string }).username
      logger.info(`Getting user ${username}`)
      const response = await this.getUserUsecase.GetUser(username)
      
      return response

    } catch (error) {
      return {
        statusCode: 500,
        body: { message: (error as Error).message }
      }
    }
  }
}