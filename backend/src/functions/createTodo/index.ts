// import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: 'POST',
        path: '/todos',
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
      Action: ['dynamodb:PutItem'],
      Resource: [
        'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TODOS_TABLE}'
      ]
    }
  ]
};
