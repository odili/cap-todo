import type { AWS } from '@serverless/typescript';

const TodosTable: AWS['resources']['Resources']['value'] = {
  Type: 'AWS::DynamoDB::Table',
  Properties: {
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'todoId', AttributeType: 'S' },
      { AttributeName: 'createdAt', AttributeType: 'S' }
    ],
    KeySchema: [
      { AttributeName: 'userId', KeyType: 'HASH' },
      { AttributeName: 'todoId', KeyType: 'RANGE' }
    ],
    BillingMode: 'PAY_PER_REQUEST',
    TableName: '${self:provider.environment.TODOS_TABLE}',
    LocalSecondaryIndexes: [
      {
        IndexName: '${self:provider.environment.TODOS_CREATED_AT_INDEX}',
        KeySchema: [
          { AttributeName: 'userId', KeyType: 'HASH' },
          { AttributeName: 'createdAt', KeyType: 'RANGE' }
        ],
        Projection: { ProjectionType: 'ALL' }
      }
    ]
  }
};

export default TodosTable;
