import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { config } from '@config/environment'
import { NodeHttpHandler } from '@smithy/node-http-handler'

const { REGION } = process.env
let client: DynamoDBClient | null = null

export const getClient = () => {
  if (client) return client
  client = new DynamoDBClient({
    region: REGION,
    requestHandler: new NodeHttpHandler({
      connectionTimeout: Number(config.sdkConnectionTimeout),
      socketTimeout: Number(config.sdkSocketTimeout)
    })
  })
  return client
}
