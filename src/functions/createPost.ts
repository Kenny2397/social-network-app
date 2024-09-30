import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'

import { CreatePostController } from '@infrastructure/adapters/in/http/CreatePostController'
import { DynamoDBCreatePostRepository } from '@infrastructure/repositories/DynamoDB/DynamoDBCreatePostRepository'
import { CreatePostUsecase } from 'src/core/app/usecases/CreatePostUsecase'
import { logger } from 'src/powertools/utilities'

const createPostController = new CreatePostController(
  new CreatePostUsecase(
    new DynamoDBCreatePostRepository()
  )
)

export const handler = async (event: APIGatewayProxyEvent, _context: Partial<Context>)
: Promise<APIGatewayProxyResult | unknown> => {
  
  logger.logEventIfEnabled(event)
  const res = await createPostController.exec(event)

  return {
    statusCode: 200,
    body: {
      data: res
    }
  }
}