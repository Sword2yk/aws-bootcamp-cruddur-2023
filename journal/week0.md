<!-- Headings -->
# Week 0 — Billing and Architecture

<!-- Headings -->
## INSTALLED AWS CLI TO WORKSPACE ON GITPOD
<br>
I updated the ``` .gitpod.yml``` file for automatic installation of AWS CLI on my GITPOD.IO workspace, after installing AWS CLI from the awscliv2.zip file. <br>
<br>

## I SETUP MY AWS CREDENTIALS AND ENV Vars WITH MY AWS ACCESS KEY INFORMATION

Using ```aws sts get-caller-identity``` to print out my userId
```
{
    "UserId": "AIDAUGTCW4JTHF5AGEMT7",
    "Account": "289043571302",
    "Arn": "arn:aws:iam::289043571302:user/uche"
}

```

<!-- Headings -->
## I SETUP AWS BUDGET WITH SUBSCRIBER NOTIFICATION USING THE JSON FILES IN AWS_JSON FOLDER.
I used the script in budget.json file to configure the budget for my root AWS account.<br>
```budget.json``` in the aws_json folder.<br>
```budget-notification-with-subscriber.json``` for  budget notification with an email subscriber.
<br>

<!-- Headings -->
## I CREATED SNS TOPIC ON MY AWS Account FOR BILLING ALARM

    
    {
        TopicArn": "arn:aws:sns:us-east-1:289043571302:billing-alarm" \
    }
    

<!-- Headings -->
## I ADDED SNS SUBSCRIBE TO THE BILLING ALARM FOR AN EMAIL ENDPOINT
<br>

    --topic-arn="arn:aws:sns:us-east-1:289043571302:billing-alarm" \
    --protocol=email \
    --notification-endpoint=boi2yk@gmail.com

<!-- Headings -->
## I SETTUP ALARM FOR DAILY ESTIMATION. 
Trigers if  daily charges exceeds 1$
<br>

json script in the aws_json folder ```alarm_config.json```
    
    aws cloudwatch put-metric-alarm --cli-input-json file://aws_json/alarm_config.json
    
