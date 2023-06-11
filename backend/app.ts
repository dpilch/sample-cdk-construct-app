#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BackendStack } from './stacks/backend-stack';
import { DeploymentStack } from './stacks/deployment-stack';

const app = new cdk.App();
const env = { region: 'us-west-2' };

new BackendStack(app, 'BackendStack', { env });
new DeploymentStack(app, 'DeploymentStack', { env });
