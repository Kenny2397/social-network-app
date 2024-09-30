import { Logger } from '@aws-lambda-powertools/logger'
import { Tracer } from '@aws-lambda-powertools/tracer'

const logger = new Logger({
  logLevel: 'INFO',
  serviceName: 'social-network-app'
})

// const metrics = new Metrics({
//   defaultDimensions: {
//     aws_account_id: process.env.AWS_ACCOUNT_ID || 'N/A',
//     aws_region: process.env.AWS_REGION || 'N/A',
//   }
// })

const tracer = new Tracer()

export {
  logger,
  tracer
}

