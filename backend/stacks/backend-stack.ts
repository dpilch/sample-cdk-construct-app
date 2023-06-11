import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import { AmplifyGraphQlApi } from 'agqlac';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new AmplifyGraphQlApi(this, 'GraphqlApi', {
      apiName: 'MyGraphQLApi',
      schema: /* GraphQL */ `
        type Todo @model @auth(rules: [{ allow: public }]) {
          description: String!
        }
      `,
      authorizationModes: [
        { type: 'API_KEY', expires: cdk.Duration.days(30) },
      ],
    });
  }
}
