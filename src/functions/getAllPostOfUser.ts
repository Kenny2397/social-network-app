import { GetAllPostController } from '@infrastructure/adapters/in/http/GetAllPostController'
import { DynamoDBPostRepository } from '@infrastructure/repositories/DynamoDB/DynamoDBPostRepository'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { GetAllPostUsecase } from 'src/core/app/usecases/GetAllPostUsecase'
import { logger } from 'src/powertools/utilities'

const getAllPostController = new GetAllPostController(
  new GetAllPostUsecase(
    new DynamoDBPostRepository()
  )
)

export const handler = async (event: APIGatewayProxyEvent, _context: Partial<Context>)
: Promise<APIGatewayProxyResult | unknown> => {

  logger.logEventIfEnabled(event)

  const res = await getAllPostController.exec(event)

  return res
}




