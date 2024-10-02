import { GetUserController } from '@infrastructure/adapters/in/http/GetUserController'
import { DynamoDBUserRepository } from '@infrastructure/repositories/DynamoDB/DynamoDBUserRepository'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { GetUserUsecase } from 'src/core/app/usecases/GetUserUsecase'
import { logger } from 'src/powertools/utilities'

const getUserController = new GetUserController(
  new GetUserUsecase(
    new DynamoDBUserRepository(),
  )
)

export const handler = async (event: APIGatewayProxyEvent, _context: Partial<Context>)
: Promise<APIGatewayProxyResult | unknown> => {
  
  logger.logEventIfEnabled(event)
  logger.appendKeys({
    service: 'Get user data'
  })
  
  const res = await getUserController.exec(event)

  return res
}



