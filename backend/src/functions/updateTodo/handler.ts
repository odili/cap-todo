import Ajv from 'ajv';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { updateTodo as editTodo } from 'src/businessLogic/todos';
import schema from './schema';
import { getUserId } from '../../auth/utils';
import { createLogger } from 'src/utils/logger';

const logger = createLogger('updateTodo');
const ajv = new Ajv();
const validate = ajv.compile(schema);

const updateTodo: APIGatewayProxyHandlerV2<typeof schema> = async (event) => {
  const todoId = event.pathParameters.todoId;
  const update = event.body;

  if (!validate(update)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid update input' })
    };
  }
  logger.info('Updating Todo: ', { todoId });

  const userId = getUserId(event.headers.authorization) as string;

  const updateResult = await editTodo({
    userId,
    todoId,
    update
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ updateResult })
  };
};

export const main = middyfy(updateTodo).use(middyJsonBodyParser());
