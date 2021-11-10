// import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { getUserId } from '../../auth/utils';
import {
  createAttachmentPresignedUrl,
  todoExists
} from 'src/businessLogic/attachmentUtils';
import { updateAttachmentUrl } from 'src/businessLogic/todos';
import { createLogger } from 'src/utils/logger';

const logger = createLogger('genImageUrl');

const generateUploadUrl: APIGatewayProxyHandlerV2<typeof schema> = async (
  event
) => {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event.headers.authorization) as string;
  const validatedTodo = await todoExists({ userId, todoId });

  if (!validatedTodo) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Todo does not exist' })
    };
  }
  logger.info('Generating uploadUrl for todo: ', { todo: todoId });

  const { uploadUrl, imageUrl } = await createAttachmentPresignedUrl(todoId);

  await updateAttachmentUrl({ userId, todoId, imageUrl });

  return {
    statusCode: 200,
    body: JSON.stringify({ uploadUrl })
  };
};

export const main = middyfy(generateUploadUrl);
