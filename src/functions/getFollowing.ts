import { GetFollowingController } from '@infrastructure/adapters/in/http/GetFollowingController'
import { DynamoDBFollowerRepository } from '@infrastructure/repositories/DynamoDB/DynamoDBFollowerRepository'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { GetFollowingUsecase } from 'src/core/app/usecases/GetFollowingUsecase'
import { logger } from 'src/powertools/utilities'

const getFollowingController = new GetFollowingController(
  new GetFollowingUsecase(
    new DynamoDBFollowerRepository()
  )
)

export const handler = async (event: APIGatewayProxyEvent, _context: Partial<Context>)
: Promise<APIGatewayProxyResult | unknown> => {

  logger.logEventIfEnabled(event)

  const res = await getFollowingController.exec(event)

  return {
    statusCode: 200,
    body: {
      data: res
    }
  }
}




