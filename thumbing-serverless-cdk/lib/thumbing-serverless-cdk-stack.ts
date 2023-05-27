import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sns from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';
import * as dotenv from 'dotenv';

dotenv.config();

export class ThumbingServerlessCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
        // The code that defines your stack goes here
        const uploadsBucketName: string = process.env.UPLOADS_BUCKET_NAME as string;
        const assetsBucketName: string = process.env.ASSETS_BUCKET_NAME as string;
        const folderInput: string = process.env.THUMBING_S3_FOLDER_INPUT as string;
        const folderOutput: string = process.env.THUMBING_S3_FOLDER_OUTPUT as string;
        const webhookUrl: string = process.env.THUMBING_WEBHOOK_URL as string;
        const topicName: string = process.env.THUMBING_TOPIC_NAME as string;
        const functionPath: string = process.env.THUMBING_FUNCTION_PATH as string;
        console.log('uploadsBucketName',)
        console.log('assetsBucketName',assetsBucketName)
        console.log('folderInput',folderInput)
        console.log('folderOutput',folderOutput)
        console.log('webhookUrl',webhookUrl)
        console.log('topicName',topicName)
        console.log('functionPath',functionPath);
  }
}