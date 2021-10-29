import type { AWS } from '@serverless/typescript';

import Lambdas from './src/functions';
import TodoResources from './src/resources';

const serverlessConfiguration: AWS = {
  service: 'serverless-todo',
  frameworkVersion: '2.63.0',
  variablesResolutionMode: '20210326',
  package: { individually: true },
  plugins: [
    'serverless-esbuild',
    'serverless-iam-roles-per-function'
    // 'serverless-plugin-tracing'
  ],
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node'
    },
    'serverless-iam-roles-per-function': {
      defaultInherit: true
    }
  },

  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-2',
    stage: "${opt: stage, 'dev'}",
    lambdaHashingVersion: '20201221',
    logs: { httpApi: true },
    // tracing: { lambda: true, apiGateway: true },
    // apiGateway: {
    //   minimumCompressionSize: 1024,
    //   shouldStartNameWithService: true
    // },
    httpApi: {
      cors: {
        allowCredentials: true,
        allowedOrigins: ['http://*', 'https://*'],
        allowedMethods: ['*'],
        allowedHeaders: ['*'],
        exposedResponseHeaders: ['*'],
        maxAge: 360
      },
      metrics: true,
      authorizers: {
        auth0: {
          type: 'jwt',
          identitySource: '$request.header.Authorization',
          issuerUrl: 'https://dev-gqta1g1g.us.auth0.com/',
          audience: ['https://use-our-Todo-App']
          // audience: ['https://dev-gqta1g1g.us.auth0.com/api/v2/']
        }
      }
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      TODOS_TABLE: 'Todos-${self:provider.stage}',
      TODOS_CREATED_AT_INDEX: 'CreatedAtIndex',
      ATTACHMENT_S3_BUCKET:
        '381183617689-todo-app-images-${self:provider.stage}',
      SINGNED_URL_EXPIRATION: '300'
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['xray:PutTelemetryRecords', 'xray: PutTraceSegments'],
            Resource: '*'
          }
        ]
      }
    }
  },
  // import the function via paths
  functions: Lambdas,

  resources: {
    Resources: TodoResources
  }
};

module.exports = serverlessConfiguration;
