# Week 9 — CI/CD with CodePipeline, CodeBuild and CodeDeploy

## Continuous Integration & Continuous Delivery
An integral part of development operations (DevOps) is adopting the culture of continuous integration and continuous delivery/deployment (CI/CD). Level up with tools to compile, build, and install features and fixes with collaborative and automated processes. These processes allow you to control versioning of your applications through a low-risk mechanism that enables agile, secure deployment and updates. CI/CD helps you keep up the pace of innovation while maintaining maximum uptime for your users.<br>
### Continuous Integration
Continuous Integration (CI) is a software process in which developers regularly push their code into a central repository such as AWS CodeCommit
or GitHub. Every code push triggers an automated build, followed by the running of tests. The main goal of CI is to discover code issues at an early stage, improve code quality, and reduce the time it takes to validate and release new software updates.<br>

### Continuous Delivery and Deployment
Continuous Delivery (CD) is a software process in which artifacts are deployed to the test environment, staging environment, and production environment. Continuous delivery can be fully automated, or have approval stages at critical points. This ensures that all required approvals prior to deployment, such as release management approval, are in place. When continuous delivery is correctly implemented, developers always have a deployment-ready build artifact that has passed through a standardized test process.<br>

### AWS CodePipeline
AWS CodePipeline is a continuous delivery service that enables you to model, visualize, and automate the steps required to release your software. With AWS CodePipeline, you model the full release process for building your code, deploying to pre-production environments, testing your application and releasing it to production. AWS CodePipeline then builds, tests, and deploys your application according to the defined workflow every time there is a code change. You can integrate partner tools and your own custom tools into any stage of the release process to form an end-to-end continuous delivery solution. 

### AWS CodeBuild
AWS CodeBuild is a fully managed continuous integration service that compiles source code, runs tests, and produces software packages that are ready to deploy. With CodeBuild, you don’t need to provision, manage, and scale your own build servers. CodeBuild scales continuously and processes multiple builds concurrently, so your builds are not left waiting in a queue. You can get started quickly by using prepackaged build environments, or you can create custom build environments that use your own build tools.<br>

### Build specification reference for CodeBuild
A buildspec is a collection of build commands and related settings, in YAML format, that CodeBuild uses to run a build.<br>
The buildspec file must be named `buildspec.yml` and placed in the root of your source directory.<br>

## Steps

Create the scripts below:
  - `buildspec.yml` for build specification in the `/backend-flask/` root directory.
  - `ecr-codebuild-backend-role.json` for aws policy in the `/aws/policies/` directory.

### Github
On the gitbub under the project `aws-bootcamp-cruddur-2023` repo, create a new branch `prod`. This will be used for AWS Codepipeline and CodeBuild.<br>

## AWS CodeBuild

On AWS Management Console: launch a service "CodeBuild"
Create build project:
Project configuration
 - Project name: `cruddur-backend-flask-bake-image`.
 - build badge (optional) - `check`.
 - Source: Github
 - Repository: select the `aws-bootcamp-cruddur-2023` repo.
 - Source version: `prod`.
 - Primary source webhook events
   - Webhook - optional
         - Rebuild every time a code change is pushed to this repository - `check`.
   - Build type: Single build.
 - Webhook event filter group 1
    - Event type: `PULL_REQUEST_MERGE`
  - Environment image: Managed image.
  - Operating system: Amazon linux 2.
  - Privileged: `check`.
  - Service role: New service role.
  - Role name: `codebuild-cruddur-backend-flask-bake-image-service-role`.
  - Timeout: `20` Minutes.
  - Compute: 3GB memory, 2 vCPUs.
  - Build specifications: Use a buildspec file.
  - Buildspec name -optional: `backend-flask/buildspec.yml`.
  - Artifact 1 - Primary
      - Type : No artifacts
  - Logs, CloudWatch logs: `check`.
  - Group name: `/cruddur/build/backend-flask`.
  - Stream name: `backend-flask`.

Attach the policy below to the service role `codebuild-cruddur-backend-flask-bake-image-service-role`.

```json
    {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "ecr:BatchCheckLayerAvailability",
                "ecr:CompleteLayerUpload",
                "ecr:GetAuthorizationToken",
                "ecr:InitiateLayerUpload",
                "ecr:PutImage",
                "ecr:UploadLayerPart",
                "ecr:BatchGetImage",
                "ecr:GetDownloadUrlForLayer"
            ],
            "Resource": "*"
               }
           ]
      }

```

Click on "Start build".

![Codebuild](https://github.com/Sword2yk/aws-bootcamp-cruddur-2023/blob/main/journal/week_9_assets/codebuild.png)

## AWS CodePipeline
On AWS Management Console: launch a service "CodePipeline"
Create pipeline:
 - Pipeline settings
    - Pipeline name: `cruddur-backend-fargate`.
    - Service role: New Service role.
 - Advanced settings
    - Artifact store: Default location.
    - Encryption key: Default AWS Managed key.
 - Add Source stagee
    - Source: Github (Version 2).
    - Create Github Connection.
    - Connection name: Cruddur.
    - Github Apps: Install a new app.
    - Choose the repo `Github`.
    - Connect
  - Choose the repo `aws-bootcamp-cruddur-2023`.
  - Branch name: `prod`.
  - Change detection options: `check`.
  - Output artifacr format: Codepipwline.
  - Add deploy stage
    - Deploy provider: Amazon ECS.
    - Cluser name: 'cruddur`.
    - Service name: `backend-flask`.
  - Add build Stage
    - Stage name: 'build'
  - Add Action
    - Action name: bake
    - Action provider: AWS Codebuild
  - Input artifacts: SourceArtifact

 ![CodePipeline](https://github.com/Sword2yk/aws-bootcamp-cruddur-2023/blob/main/journal/week_9_assets/codepipeline.png)   

## Pipeline Testing

Run the Release change from CodePipeline service.
Amazon ECS `cruddur` backend-flask fargate service running as below.
![ECS](https://github.com/Sword2yk/aws-bootcamp-cruddur-2023/blob/main/journal/week_9_assets/ECS_fargate_backend.png)

