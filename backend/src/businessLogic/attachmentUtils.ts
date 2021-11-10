// import * as AWS from 'aws-sdk';
// import * as AWSXRay from 'aws-xray-sdk';

// const XAWS = AWSXRay.captureAWS(AWS);
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { TodosAccess } from 'src/dataLayer/TodosAccess';
import { GetTodoParams } from 'src/models/Todo';
const todoAccess = new TodosAccess();

// const s3 = new XAWS.S3({ signatureVersion: 'v4' });
const s3 = new S3Client({});

// TODO: Implement the fileStogare logic

const bucketName = process.env.ATTACHMENT_S3_BUCKET;
const urlExpiration = process.env.SINGNED_URL_EXPIRATION;

export async function todoExists(params: GetTodoParams) {
  const result = await todoAccess.getTodo(params);

  return Boolean(result.Item);
}

export async function createAttachmentPresignedUrl(todoId: string) {
  const imageUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`;
  const uploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: bucketName,
      Key: todoId
    }),
    { expiresIn: parseInt(urlExpiration) }
  );

  return { imageUrl, uploadUrl };
}
