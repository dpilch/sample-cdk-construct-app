import { Construct } from 'constructs';
import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { AmplifyGraphQlApi } from 'agqlac';

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new AmplifyGraphQlApi(this, 'GraphqlApi', {
      apiName: 'MyGraphQLApi',
      schema: /* GraphQL */ `
        type Todo @model @auth(rules: [{ allow: public }]) {
          description: String!
        }
      `,
      authorizationModes: [
        { type: 'API_KEY', expires: Duration.days(30) },
      ],
    });
  }
}
