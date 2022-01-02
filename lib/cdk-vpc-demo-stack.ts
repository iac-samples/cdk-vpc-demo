import { CfnOutput, Construct, Stack, StackProps } from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import ssm = require('@aws-cdk/aws-ssm');

export class CdkVpcDemoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', {
      cidr: '10.0.0.0/16',
      maxAzs: 2,
      natGateways: 1,
      enableDnsHostnames: true,
      enableDnsSupport: true,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
        },
        {
          cidrMask: 24,
          name: 'Isolated',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // create an SSM parameters which store export VPC ID
    new ssm.StringParameter(this, 'VPCID', {
      parameterName: `/VpcProvider/VPCID`,
      stringValue: vpc.vpcId
    });

    new CfnOutput(this, 'VPCId', {value: vpc.vpcId, exportName: 'VPCId'});
    new CfnOutput(this, 'PublicSubnetIds', {value: vpc.publicSubnets.map(s => s.subnetId).join(','), exportName: 'PublicSubnetIds'});
    new CfnOutput(this, 'PrivateSubnetIds', {value: vpc.isolatedSubnets.map(s => s.subnetId).join(','), exportName: 'PrivateSubnetIds'});
    new CfnOutput(this, 'IsolatedSubnetIds', {value: vpc.isolatedSubnets.map(s => s.subnetId).join(','), exportName: 'IsolatedSubnetIds'});
  }
}
