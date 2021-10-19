import type { AWS } from '@serverless/typescript';

const GatewayResponseDefault4XX: AWS['resources']['Resources']['value'] = {
  Type: 'AWS::ApiGateway::GatewayResponse',
  Properties: {
    ResponseParameters: {
      'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
      'gatewayresponse.header.Access-Control-Allow-Headers':
        "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
      'gatewayresponse.header.Access-Control-Allow-Methods':
        "'GET,OPTIONS,POST'"
    },
    ResponseType: 'DEFAULT_4XX',
    RestApiId: { Ref: 'ApiGatewayRestApi' }
  }
};

export default GatewayResponseDefault4XX;
