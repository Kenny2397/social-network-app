import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { Handler } from 'src/core/app/ports/in/http/handler'
import { CreateUserSchema } from 'src/core/app/schemas/UserSchema'
import { CreateUserUsecase } from 'src/core/app/usecases/CreateUserUsecase'
import { responseHandler } from 'src/powertools/utilities'

export class CreateUserController implements Handler<APIGatewayProxyEvent, Partial<Context>> {

  constructor (
    private readonly createUserUsecase: CreateUserUsecase 
  ) {}

  async exec (event: APIGatewayProxyEvent) {
    try {
      const eventBody = event.body
      
      const userData = CreateUserSchema.parse(eventBody)

      const response = await this.createUserUsecase.CreateUser(userData)
      
      return responseHandler(200, {
        username: response
      })
    } catch (error) {
      return responseHandler(500, null, error)
    }
  }
}