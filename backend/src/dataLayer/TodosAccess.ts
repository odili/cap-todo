// import * as AWS from 'aws-sdk';
// import * as XRay from 'aws-xray-sdk';
// import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommandInput,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
  UpdateCommand,
  UpdateCommandInput,
  DeleteCommand,
  DeleteCommandInput,
  GetCommand,
  GetCommandInput
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  TodoItem,
  GetParams,
  TodoUpdateParams,
  AttachmentUpdateParams,
  TodoDeleteParams,
  GetTodoParams
} from 'src/models/Todo';

// const XAWS = XRay.captureAWS(AWS);
const client = new DynamoDBClient({ region: 'us-east-2' });
export class TodosAccess {
  constructor(
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todoIndex = process.env.TODOS_CREATED_AT_INDEX,
    private readonly docClient = DynamoDBDocumentClient.from(client)
  ) {}

  async getAll({ userId }: GetParams) {
    const params: QueryCommandInput = {
      TableName: this.todosTable,
      IndexName: this.todoIndex,
      ExpressionAttributeValues: {
        ':uid': userId
      },
      KeyConditionExpression: 'userId = :uid'
      // Limit: limit,
      // ExclusiveStartKey: { S: nextKey }
    };

    return await this.docClient.send(new QueryCommand(params));
  }

  async create(todo: TodoItem) {
    const params: PutCommandInput = {
      TableName: this.todosTable,
      Item: todo
    };
    await this.docClient.send(new PutCommand(params));

    return todo;
  }

  async updateTodo({ userId, todoId, update }: TodoUpdateParams) {
    const params: UpdateCommandInput = {
      TableName: this.todosTable,
      Key: { todoId, userId },
      ExpressionAttributeNames: { '#title': 'name' },
      UpdateExpression: 'set #title = :nm, dueDate = :due, done = :don',
      ExpressionAttributeValues: {
        ':nm': update.name,
        ':due': update.dueDate,
        ':don': update.done
      },
      ReturnValues: 'ALL_NEW'
    };
    const updateResult = await this.docClient.send(new UpdateCommand(params));

    return updateResult.Attributes;
  }

  async updateTodoAttachment({
    todoId,
    imageUrl,
    userId
  }: AttachmentUpdateParams) {
    const params: UpdateCommandInput = {
      TableName: this.todosTable,
      Key: { todoId, userId },
      UpdateExpression: 'set attachmentUrl = :iur',
      ExpressionAttributeValues: {
        ':iur': imageUrl
      },
      ReturnValues: 'ALL_NEW'
    };
    const update = await this.docClient.send(new UpdateCommand(params));

    return update.Attributes;
  }

  async delete({ todoId, userId }: TodoDeleteParams) {
    const params: DeleteCommandInput = {
      TableName: this.todosTable,
      Key: { todoId, userId }
    };
    return await this.docClient.send(new DeleteCommand(params));
  }

  async getTodo({ userId, todoId }: GetTodoParams) {
    const params: GetCommandInput = {
      TableName: this.todosTable,
      Key: { todoId, userId }
    };

    return await this.docClient.send(new GetCommand(params));
  }
}
