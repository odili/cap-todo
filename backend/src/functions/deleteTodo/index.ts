// import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: 'DELETE',
        path: '/todos/{todoId}',
        authorizer: 'auth0'
      }
    }
  ],
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['dynamodb:GetItem', 'dynamodb:DeleteItem'],
      Resource: [
        'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TODOS_TABLE}'
      ]
    }
  ]
};
