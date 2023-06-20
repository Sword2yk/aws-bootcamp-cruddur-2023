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
- Run `cdk bootstrap` "aws://${AWS_ACCOUNT_ID}/${AWS_DEFAULT_REGION}"
- Run `cdk deploy` to create on the AWS CloudFormation

![cdk deploy](https://github.com/Sword2yk/aws-bootcamp-cruddur-2023/blob/main/journal/week_8_assets/cdk%20deploy.png)

#### CloudFormation Stacks
ThumbingServerlessCdkCdkStack & CDKToolkit Stacks.<br>

![CloudFormation Stacks](https://github.com/Sword2yk/aws-bootcamp-cruddur-2023/blob/main/journal/week_8_assets/CloudFormation.png)

### Amazon S3 bucket

S3 Bucket: `obi-cruddur-uploaded-avatars` and `obi-cruddur-uploaded-avatars`
![S3](journal/week_8_assets/Bucket S3.png)

- Run `./bin/avatar/upload`, to upload `data.jpg` into the Amazon S3 bucket `obi-cruddur-uploaded-avatars`. This triggers the `Lambda` function to process the image and saved into the `avatars` folder.<br>

Avatars/processed.
![Data](https://github.com/Sword2yk/aws-bootcamp-cruddur-2023/blob/main/journal/week_8_assets/avatars_data.jpg)

## CloudFront Setup
Generate a certificate in `us-east-1` zone for `obi-aws-bootcamp.space` domain, from the Route 53 record.

CloudFront Distribution:

- Select the Origin domain to point the S3 bucket `assets.<DOMAIN_NAME>`
- Choose the Origin access control settings (recommended) and create a control setting from the drop down.
- Viewer protocol select Redirect HTTP to HTTPS.
- Response headers policy select CachingOptimized, CORS-CustomOrigin as the optional Origin request policy, and SimpleCORS.
- Set `assets.<DOMAIN_NAME>` as Alternate domain name (CNAME).
- Select the AWS Certificate Manager (ACM) for the custom SSL certificate.

Attached [S3-upload-avatar-presigned-url-policy](aws/policies/s3-upload-avatar-presigned-url-policy.json) to the S3 bucket.<br>
![Distribution](https://github.com/Sword2yk/aws-bootcamp-cruddur-2023/blob/main/journal/week_8_assets/CloudFront.png)
### Route 53
- Create a record `assets.obi-aws-bootcamp.space`
- Record type `A-Routes traffic to an IPv4 address and AWS resourese`
- Alias - `ON`
- Route traffic to - CloudFront distribution (`d3ujpi01dy9k5q.cloudfront.net`)
- Routing policy - `Simple routing`.

Run `./bin/avatar/upload` to upload the avatar (profile) in the avatars S3 bucket. This case be access via the CloudFront.
@ https://assets.obi-aws-bootcamp.space/avatars/data.jpg.

Add Invalidation details to edge chaches old avatar. Invalidation will allow CloudFront to always serve the latest avatar uploaded.
![Invalidation](https://github.com/Sword2yk/aws-bootcamp-cruddur-2023/blob/main/journal/week_8_assets/Invalidation.png)

## Backend for Profile Page
Backend files updated for the profile page.<br>
- `backend-flask/app.py`.
- `backend-flask/services/user_activities.py`.
- `backend-flask/services/update_profile.py`.
- `backend-flask/db/sql/users/update.sql`.
- `backend-flask/db/sql/users/show.sql`.
<br>

[Backend file path](backend-flask)

## Frontend for Profile Page
Frontend files updated or created for the profile page.<br>
- `frontend-react-js/src/App.js`.
- `frontend-react-js/src/lib/CheckAuth.js`.
- `frontend-react-js/jsconfig.json`.
- `frontend-react-js/src/pages/HomeFeedPage.js`.
- `frontend-react-js/src/pages/NotificationsFeedPage.js`.
- `frontend-react-js/src/pages/UserFeedPage.js`.
- `frontend-react-js/src/components/ActivityFeed.js`.
- `frontend-react-js/src/components/CrudButton.js`.
- `frontend-react-js/src/components/DesktopNavigation.js`.
- `frontend-react-js/src/components/EditProfileButton.css`.
- `frontend-react-js/src/components/EditProfileButton.js`.
- `frontend-react-js/src/components/Popup.css`.
- `frontend-react-js/src/components/ProfileAvatar.css`.
- `frontend-react-js/src/components/ProfileAvatar.js`.
- `frontend-react-js/src/components/ProfileForm.css`.
- `frontend-react-js/src/components/ProfileForm.js`.
- `frontend-react-js/src/components/ProfileHeading.css`.
- `frontend-react-js/src/components/ProfileHeading.js`.
- `frontend-react-js/src/components/ProfileInfo.js`.
- `frontend-react-js/src/components/ReplyForm.css`.
  <br>
  
[Frontend file path](frontend-react-js)

## Database Migration
Add `bio` column in the postgres database to migrate the database. Run `./bin/generate/migration` to `add_bio_column` and a script `16855375451814039_add_bio_column.py` [add_bio](backend-flask/db/migrations/16855375451814039_add_bio_column.py) (python script) will be generated. Update `./db/schema.sql` and `.backend-flask/lib/db.py` with verbose. Create a scripts `./bin/db/migrate` and `./bin/db/rollback`. Run `./bin/db/migrate/` to add the column `bio` to `users` table in the db.

## Image Processing
Create an API endpoint, to invoke a presigned URL `https://<API_ID>.execute-api.<AWS_REGION>.amazonaws.com`, which gives an authorization access to the S3 bucket.<br>
![API](https://github.com/Sword2yk/aws-bootcamp-cruddur-2023/blob/main/journal/week_8_assets/API.png)
This action will call the API `https://<API_ID>.execute-api.<AWS_REGION>.amazonaws.com/avatars/key_upload` do the upload, where the `/avatars/key_upload` resource is manipulated by the `POST` method. Create a Lambda function named `CruddurAvatarUpload` to decode the URL and the request. Implement authorization with another Lambda function named `CruddurApiGatewayLambdaAuthorizer`, which is important to control the data that is allowed to be transmitted from our gitpod workspace using the APIs.

- Create a basic ruby function `function.rb, in `aws/lambdas/cruddur-upload-avatar/` run `bundle init` in the file directory.
- Edit the `Gemfile` and add some packages to install `OX`, `aws-sdk-s3` and `jwt`.
- Run `bundle install` and `bundle exec ruby function.rb`. [Ruby function](aws/lambdas/cruddur-upload-avatar/function.rb).
- Ruby Lambda function used `CruddurAvatarUpload`.
- Create the lambda authorizer in `aws/lambdas/lambda-authorizer/`, add `index.js` and run `npm install aws-jwt-verify --save`.
- Right on the files in the directory `aws/lambdas/lambda-authorizer/` and download the files `index.js`, `package.json` and `package-lock.json`. Zip the files into zip file `lambda_authorizer.zip`.

AWS Lambda Functions:
1. Lambda Function `CruddurAvatarUpload`.<br>

   ![CruddurAvatarUpload](https://github.com/Sword2yk/aws-bootcamp-cruddur-2023/blob/main/journal/week_8_assets/lambda_function_handler.png)
    - Copy the source code from the file path `aws/lambdas/cruddur-upload-avatar/` and update the `Access-Control-Allow-Origin` with the   gitpod frontend and backend URL.
    - Rename the `function.rb` to `function.handler`.
    - Add the environment variable `UPLOADS_BUCKET_NAME`.
    - Attach the new policy role below to `CruddurAvatarUpload` lambda function.
   
    ```json
        {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "VisualEditor0",
                "Effect": "Allow",
                "Action": "s3:PutObject",
                "Resource": "arn:aws:s3:::obi-cruddur-uploaded-avatars/*"
            }
          ]
        }
        
    ```


2. Lambda function Authorizer `CruddurApiGatewayLambdaAuthorizer` <br>

    ![CruddurApiGatewayLambdaAuthorizer](https://github.com/Sword2yk/aws-bootcamp-cruddur-2023/blob/main/journal/week_8_assets/lambda_authorizer_api.png)
    - Create a Lambda function `CruddurApiGatewayLambdaAuthorizer`.
    - Upload the zip file `lambda_authorizer.zip`.

Amazon S3:
 -  Update the permissions of `obi-cruddur-uploaded-avatars` bucket by editing the Cross-origin resource sharing (CORS) and add the json code below.

 ```json
      [
        {
            "AllowedHeaders": [
            "*"
            ],
            "AllowedMethods": [
                "PUT"
            ],
            "AllowedOrigins": [
                "https://*.gitpod.io"
            ],
            "ExposeHeaders": [
                "x-amz-server-side-encryption",
                "x-amz-request-id",
                "x-amz-id-2"
            ],
            "MaxAgeSeconds": 3000
        }
       ]
```

Amazon API Gateway:
- Create HTTP API gateway `api.obi-aws-bootcamp.space`.
- Add two Routes.
    - `POST: /avatar/key_upload` with authorizer `CruddurJWTAuthorizer` which invoke Lambda `CruddurApiGatewayLambdaAuthorizer`, and with integration `CruddurAvatarUpload`.<br>
      ![Route POST](https://github.com/Sword2yk/aws-bootcamp-cruddur-2023/blob/main/journal/week_8_assets/Route_POST.png)
    - `OPTIONS: /{proxy+}` without authorizer, but with integration `CruddurAvatarUpload`.<br>
      ![Route OPTIONS](https://github.com/Sword2yk/aws-bootcamp-cruddur-2023/blob/main/journal/week_8_assets/Route_OPTIONS.png)

## Environment Variables Checks

- function.rb in `CruddurAvatarUpload`: set `Access-Control-Allow-Origin` as your own frontend URL and backend URL.
- `index.js` in `CruddurApiGatewayLambdaAuthorizer`: ensure that token can be correctly extracted from the authorization header.
- Environment variables in the above two Lambdas were added.
  - `erb/frontend-react-js.env.erb`: `REACT_APP_API_GATEWAY_ENDPOINT_URL` equals to the Invoke URL shown in the API Gateway.
  - `frontend-react-js/src/components/ProfileForm.js`: `gateway_url` and `backend_url` are correctly set.
- Inconsistency checks in some scripts, e.g., `cognito_user_uuid` vs. `cognito_user_id`.

## Reference

- [AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html)
- [Amazon S3 Construct Library](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3-readme.html)
- [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html)
- [Amazon CloudFront](https://www.amazonaws.cn/en/cloudfront/)
- [Amazon API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html)
