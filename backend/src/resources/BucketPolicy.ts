import type { AWS } from '@serverless/typescript'

const BucketPolicy: AWS['resources']['Resources']['value'] = {
  Type: 'AWS::S3::BucketPolicy',
  Properties: {
    PolicyDocument: {
      Id: 'TodoImagePolicy',
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadForGetBucketObjects',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource:
            'arn:aws:s3:::${self:provider.environment.ATTACHMENT_S3_BUCKET}/*'
        }
      ]
    },
    Bucket: '${self:provider.environment.ATTACHMENT_S3_BUCKET}'
  }
}

export default BucketPolicy
