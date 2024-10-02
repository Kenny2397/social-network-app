import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'

import { CreatePostController } from '@infrastructure/adapters/in/http/CreatePostController'
import { DynamoDBPostRepository } from '@infrastructure/repositories/DynamoDB/DynamoDBPostRepository'
import { DynamoDBUserRepository } from '@infrastructure/repositories/DynamoDB/DynamoDBUserRepository'
import { CreatePostUsecase } from 'src/core/app/usecases/CreatePostUsecase'
import { logger } from 'src/powertools/utilities'

const createPostController = new CreatePostController(
  new CreatePostUsecase(
    new DynamoDBUserRepository(),
    new DynamoDBPostRepository()
  )
)

export const handler = async (event: APIGatewayProxyEvent, _context: Partial<Context>)
: Promise<APIGatewayProxyResult | unknown> => {
  
  logger.logEventIfEnabled(event)
  const res = await createPostController.exec(event)

  return res
}