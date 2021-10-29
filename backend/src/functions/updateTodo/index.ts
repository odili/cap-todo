// import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: 'PATCH',
        path: '/todos/{todoId}',
        authorizer: 'auth0'
        // request: {
        //   schemas: {
        //     'application/json': schema
        //   }
        // }
      }
    }
  ],
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['dynamodb:Query', 'dynamodb:UpdateItem'],
      Resource: [
        'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TODOS_TABLE}'
      ]
    }
  ]
};
