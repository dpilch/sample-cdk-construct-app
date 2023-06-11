import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';

export class SecretsStack extends Stack {
  readonly githubAccessToken: Secret;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.githubAccessToken = new Secret(this, 'GithubAccessToken');
  }
}
