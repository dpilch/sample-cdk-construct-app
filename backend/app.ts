#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { BackendStack } from './stacks/backend-stack';
import { DeploymentStack } from './stacks/deployment-stack';
import { SecretsStack } from './stacks/secrets-stack';

const app = new App();
const env = { region: 'us-west-2' };

const secretsStack = new SecretsStack(app, 'SecretsStack', { env });

new DeploymentStack(app, 'DeploymentStack', {
  env,
  githubAccessToken: secretsStack.githubAccessToken,
});

new BackendStack(app, 'BackendStack', { env });
