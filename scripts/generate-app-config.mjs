import * as path from 'path';
import * as fs from 'fs';
import * as process from 'process';
import { CloudFormationClient, DescribeStacksCommand } from '@aws-sdk/client-cloudformation';

const appConfigPath = path.join(process.cwd(), 'src', 'appConfig.ts');

const generateAppConfig = ({ apiKey, graphqlUrl }) => {
  return `const appConfig = {
  aws_appsync_graphqlEndpoint: '${graphqlUrl}',
  aws_appsync_authenticationType: 'API_KEY',
  aws_appsync_apiKey: '${apiKey}',  
};
  
export default appConfig;
`;
};

const loadData = async () => {
  const results = await new CloudFormationClient().send(new DescribeStacksCommand({}));
  const backendStack = results.Stacks.filter(stack => stack.StackName === 'BackendStack')[0];
  return {
    apiKey: backendStack.Outputs.filter(output => output.OutputKey === 'GraphQLAPIKeyOutput')[0].OutputValue,
    graphqlUrl: backendStack.Outputs.filter(output => output.OutputKey === 'GraphQLAPIEndpointOutput')[0].OutputValue,
  };
};

const writeAppConfigFile = async () => {
  const apiConfig = await loadData();
  const appConfigContents = generateAppConfig(apiConfig);
  fs.writeFileSync(appConfigPath, appConfigContents);
  process.exit(0);
};

writeAppConfigFile();
