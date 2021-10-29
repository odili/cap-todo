// import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: 'GET',
        path: '/todos',
        authorizer: 'auth0'
      }
    }
  ],
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['dynamodb:GetItem', 'dynamodb:BatchGetItem', 'dynamodb:Query'],
      Resource: [
        'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TODOS_TABLE}',
        'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TODOS_TABLE}/index/*'
      ]
    },
    {
      Effect: 'Allow',
      Action: ['s3:GetObject'],
      Resource: [
        'arn:aws:s3:::${self:provider.environment.ATTACHMENT_S3_BUCKET}/*'
      ]
    }
  ]
};
