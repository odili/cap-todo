import type { AWS } from '@serverless/typescript'

const AttachmentBucket: AWS['resources']['Resources']['value'] = {
  Type: 'AWS::S3::Bucket',
  Properties: {
    BucketName: '${self:provider.environment.ATTACHMENT_S3_BUCKET}',
    CorsConfiguration: {
      CorsRules: [
        {
          AllowedOrigins: ['*'],
          AllowedHeaders: ['*'],
          AllowedMethods: ['GET', 'PUT', 'POST', 'HEAD', 'DELETE'],
          MaxAge: 3000
        }
      ]
    }
  }
}

export default AttachmentBucket
