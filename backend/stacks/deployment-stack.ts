import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Role, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { App, Branch, GitHubSourceCodeProvider } from '@aws-cdk/aws-amplify-alpha';

export type DeploymentStackProps = StackProps & {
  githubAccessToken: Secret;
};

/**
 * Deploy a service-linked-role for Amplify to use to deploy CDK,
 * then 
 */
export class DeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props: DeploymentStackProps) {
    super(scope, id, props);

    const serviceRole = new Role(this, 'AmplifyServiceRole', {
      assumedBy: new ServicePrincipal('amplify.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess-Amplify'),
      ],
    });

    const app = new App(this, 'AmplifyApp', {
      sourceCodeProvider: new GitHubSourceCodeProvider({
        owner: 'aherschel',
        repository: 'sample-cdk-construct-app',
        oauthToken: props.githubAccessToken.secretValue,
      }),
      role: serviceRole,
    });

    new Branch(this, 'main', { app });
  }
}
