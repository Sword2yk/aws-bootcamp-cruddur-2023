# Week 8 — Serverless Image Processing

# AWS Cloud Development Kit (AWS CDK) 
An AWS CDK app is an application written in TypeScript, JavaScript, Python, Java, C# or Go that uses the AWS CDK to define AWS infrastructure. An app defines one or more stacks. Stacks (equivalent to AWS CloudFormation stacks) contain constructs. Each construct defines one or more concrete AWS resources, such as Amazon S3 buckets, Lambda functions, or Amazon DynamoDB tables.<br>
# AWS CloudFormation
AWS CloudFormation is a service that helps you model and set up your AWS resources so that you can spend less time managing those resources and more time focusing on your applications that run in AWS. You create a template that describes all the AWS resources that you want (like Amazon EC2 instances or Amazon RDS DB instances), and CloudFormation takes care of provisioning and configuring those resources for you. You don't need to individually create and configure AWS resources and figure out what's dependent on what; CloudFormation handles that.<br>
# Amazon API Gateway
Amazon API Gateway is a fully managed service that makes it easy for developers to create, publish, maintain, monitor, and secure APIs at any scale. APIs act as the "front door" for applications to access data, business logic, or functionality from your backend services. Using API Gateway, you can create RESTful APIs and WebSocket APIs that enable real-time two-way communication applications. API Gateway supports containerized and serverless workloads, as well as web applications.<br>
## API Gateway Authentication
API gateway authentication is an important way to control the data that is allowed to be transmitted using your APIs.<br>
## API Gateway Stage
A stage is a named reference to a deployment, which is a snapshot of the API. You use a Stage to manage and optimize a particular deployment. For example, you can configure stage settings to enable caching, customize request throttling, configure logging, define stage variables, or attach a canary release for testing.<br>
## API Gateway Cross-origin resource sharing (CORS)
Cross-origin resource sharing (CORS) is a browser security feature that restricts HTTP requests that are initiated from scripts running in the browser.
CORS is typically required to build web applications that access APIs hosted on a different domain or origin. You can enable CORS to allow requests to your API from a web application hosted on a different domain.<br>
# Amazon CloudFront
Amazon CloudFront is a web service that speeds up distribution of your static and dynamic web content, such as .html, .css, .js, and image files, to your users. CloudFront delivers your content through a worldwide network of data centers called edge locations.<br>
# AWS Lambda
AWS Lambda is a compute service that lets you run code without provisioning or managing servers.
Lambda runs your code on a high-availability compute infrastructure and performs all of the administration of the compute resources, including server and operating system maintenance, capacity provisioning and automatic scaling, and logging. With Lambda, all you need to do is supply your code in one of the language runtimes that Lambda supports.

# Work Flow
Create a new directory for CDK pipeline in a new top level tree.

```cmd
  cd /workspace/aws-bootcamp-cruddur-2023
  mkdir thumbing-serverless-cdk

```
CDK(Cloud Development Kit) is used to create S3 bukets, SNS topics and lambda functions.

## Install CDK globally
Using AWS CDK CLI for global installation.<br>


```cli
  cd thumbing-serverless-cdk
  
  npm install aws-cdk -g
  cdk init app --language typescript
  npm install dotenv
  
```

Create a new file in `bin` directory for docker compose up.<br>
Scripts:<br>
`./bin/bootstrap` to generate backend & frontend environment variables. [Bootstrap code](bin/booststrap)<br>
`./bin/prepare`. for db and ddb preparation. [db/ddb code](bin/prepare)<br>
Update the env vars with my domain name.`obi-aws-bootcamp.space` and create an S3 bucket `assets.obi-aws-bootcamp.space`. In this bucket create another a folder name `banners`, and upload a banner.jpg into the `banners` folder.<br>

```bash
  export UPLOADS_BUCKET_NAME="obi-cruddur-uploaded-avatars"
  gp env UPLOADS_BUCKET_NAME="obi-cruddur-uploaded-avatars"
  
  export DOMAIN_NAME="obi-aws-bootcamp.space"
  gp env DOMAIN_NAME="obi-aws-bootcamp.space"
```
Update `.env.example` ([env.example](thumbing-serverless-cdk/.env.example)) with UPLOADS_BUCKET_NAME, ASSETS_BUCKET_NAME, S3 output folder and SNS topic.

## Create AWS CloudFormation Stack
- Run `cdk synth` to generate cdk </li>
- Run `cdk bootstrap` "aws://${AWS_ACCOUNT_ID}/${AWS_DEFAULT_REGION}"</li>
- Run `cdk deploy` to create on the AWS CloudFormation</li>
    
#### CloudFormation Stacks
ThumbingServerlessCdkCdkStack & CDKToolkit Stacks.<br>

![CloudFormation Stacks]()

### Amazon S3 bucket

S3 Bucket: `obi-cruddur-uploaded-avatars` and `obi-cruddur-uploaded-avatars`
![]()

- Run `./bin/avatar/upload`, to upload `data.jpg` into the Amazon S3 bucket `obi-cruddur-uploaded-avatars`. This triggers the `Lambda` function to process the image and saved into the `avatars` folder.<br>

Avatars/processed.
![Data]()

## CloudFront Setup
Generate a certificate in `us-east-1` zone for `obi-aws-bootcamp.space` domain, from the Route 53 record.

CloudFront Distribution:

- Select the Origin domain to point the S3 bucket `assets.<DOMAIN_NAME>`
- Choose the Origin access control settings (recommended) and create a control setting from the drop down.
- Viewer protocol select Redirect HTTP to HTTPS.
- The response headers policy select CachingOptimized, CORS-CustomOrigin as the optional Origin request policy, and SimpleCORS.
- Set `assets.<DOMAIN_NAME>` as Alternate domain name (CNAME).
- Select the AWS Certificate Manager (ACM) for the custom SSL certificate.

Attached [S3-upload-avatar-presigned-url-policy](aws/policies/s3-upload-avatar-presigned-url-policy.json) to the S3 bucket.

### Route 53
- Create a record `assets.obi-aws-bootcamp.space`
