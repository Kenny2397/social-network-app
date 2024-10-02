import { CreateUserController } from '@infrastructure/adapters/in/http/CreateUserController'
import { DynamoDBUserRepository } from '@infrastructure/repositories/DynamoDB/DynamoDBUserRepository'
import { APIGatewayProxyEvent, APIGatewayProxyResult, type Context } from 'aws-lambda'
import { CreateUserUsecase } from 'src/core/app/usecases/CreateUserUsecase'
import { logger } from 'src/powertools/utilities'

const createUserController = new CreateUserController(
  new CreateUserUsecase(
    new DynamoDBUserRepository()
  )
)

export const handler = async (event: APIGatewayProxyEvent, _context: Partial<Context>)
: Promise<APIGatewayProxyResult | unknown> => {

  logger.logEventIfEnabled(event)
  const res = await createUserController.exec(event)

  return res
}



