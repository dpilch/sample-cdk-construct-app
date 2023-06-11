import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as amplify from '@aws-cdk/aws-amplify-alpha';

/**
 * Deploy a service-linked-role for Amplify to use to deploy CDK,
 * then 
 */
export class DeploymentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const serviceRole = new iam.Role(this, 'AmplifyServiceRole', {
      assumedBy: new iam.ServicePrincipal('amplify.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess-Amplify'),
      ],
    });

    const githubAccessToken = new secretsmanager.Secret(this, 'GithubAccessToken');

    const app = new amplify.App(this, 'AmplifyApp', {
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: 'aherschel',
        repository: 'sample-cdk-construct-app',
        oauthToken: githubAccessToken.secretValue,
      }),
      role: serviceRole,
    });

    new amplify.Branch(this, 'main', { app });
  }
}
