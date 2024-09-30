import { GetFollowerController } from '@infrastructure/adapters/in/http/GetFollowerController'
import { DynamoDBFollowerRepository } from '@infrastructure/repositories/DynamoDB/DynamoDBFollowerRepository'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { GetFollowerUsecase } from 'src/core/app/usecases/GetFollowerUsecase'
import { logger } from 'src/powertools/utilities'

const getFollowerController = new GetFollowerController(
  new GetFollowerUsecase(
    new DynamoDBFollowerRepository()
  )
)

export const handler = async (event: APIGatewayProxyEvent, _context: Partial<Context>)
: Promise<APIGatewayProxyResult | unknown> => {

  logger.logEventIfEnabled(event)

  const res = await getFollowerController.exec(event)

  return {
    statusCode: 200,
    body: {
      data: res
    }
  }
}




