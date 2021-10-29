// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '4x2rvnz2x2'
// export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-gqta1g1g.us.auth0.com', // Auth0 domain
  clientId: 'wUxazNzO9jXtasOpHiZQnN350pf9D1Y6', // Auth0 client id
  callbackUrl: 'http://localhost:3000'
}
