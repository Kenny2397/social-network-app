import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'

import { SetFollowerController } from '@infrastructure/adapters/in/http/SetFollowerController'
import { DynamoDBFollowerRepository } from '@infrastructure/repositories/DynamoDB/DynamoDBFollowerRepository'
import { SetFollowerUsecase } from 'src/core/app/usecases/SetFollowerUsecase'
import { logger } from 'src/powertools/utilities'

const setFollowerController = new SetFollowerController(
  new SetFollowerUsecase(
    new DynamoDBFollowerRepository()
  )
)

export const handler = async (event: APIGatewayProxyEvent, _context: Partial<Context>)
: Promise<APIGatewayProxyResult | unknown> => {
  
  logger.logEventIfEnabled(event)
  const res = await setFollowerController.exec(event)

  return res
}