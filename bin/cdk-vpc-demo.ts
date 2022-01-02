#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkVpcDemoStack } from '../lib/cdk-vpc-demo-stack';

const app = new cdk.App();
new CdkVpcDemoStack(app, 'CdkVpcDemoStack', {
  env: {
    region: process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});