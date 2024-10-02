import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { Handler } from 'src/core/app/ports/in/http/handler'
import { GetAllPostUsecase } from 'src/core/app/usecases/GetAllPostUsecase'
import { logger, responseHandler } from 'src/powertools/utilities'

export class GetAllPostController implements Handler<APIGatewayProxyEvent, Partial<Context>> {

  constructor (
    private readonly getAllPostUsecase: GetAllPostUsecase
  ) {}

  async exec (event: APIGatewayProxyEvent) {
    try {
      const username = (event.path as unknown as { username: string }).username
      logger.info(`Getting a list of post for username: ${username}`)
      const response = await this.getAllPostUsecase.GetAllPostList(username)
      
      return responseHandler(200, {
        data: response
      })
    } catch (error) {
      return responseHandler(500, null, error as Error)
    }
  }
}