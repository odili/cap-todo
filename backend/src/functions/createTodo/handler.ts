import Ajv from 'ajv';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import schema from './schema';
import { create } from 'src/businessLogic/todos';
import { getUserId } from 'src/auth/utils';
import { createLogger } from 'src/utils/logger';

const logger = createLogger('createTodo');
const ajv = new Ajv();
const validate = ajv.compile(schema);
const createTodo: APIGatewayProxyHandlerV2<typeof schema> = async (event) => {
  logger.info(event.body);
  const draftTodo = event.body;
  if (!validate(draftTodo)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid name or dueDate' })
    };
  }
  logger.info('Creating new todo: ', draftTodo);
  const userId = getUserId(event.headers.authorization) as string;

  logger.info('userId', userId);

  const newTodo = await create(userId, draftTodo);

  return {
    statusCode: 201,
    body: JSON.stringify({ item: newTodo })
  };
};

export const main = middyfy(createTodo).use(middyJsonBodyParser())
