#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AmplifyGraphQlApi } from 'agqlac';

const stack = new cdk.Stack(new cdk.App(), 'BackendStack');

new AmplifyGraphQlApi(stack, 'GraphqlApi', {
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
