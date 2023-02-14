# Week 0 — Billing and Architecture
**INSTALLED AWS CLI TO WORKSPACE ON GITPOD**
UPDATED 'gitpod.yml' FILE FOR AUTO INSTALLATION ON AWS CLI ON MY GITPOD.IO WORKSPACE
**I SET MY AWS CREDENTIALS AND ENV Vars WITH MY AWS ACCESS KEY INFORMATION**
{
    "UserId": "###########",
    "Account": "********",
    "Arn": "arn:aws:iam::*******:user/uche"
}

**I SETUP AWS BUDGET USING THE JSON FILES IN AWS_JSON FOLDER.**
budget.json FILE - WHICH CONTAINS JSON SCRIPT TO CONFIGURE THE BUDGET ON MY AWS ROOT ACCOUNT
budget-notification-with-subscriber.json FILE - JSON SCRIPT THAT CONFIGURE NOTIFICATION WITH EMAIL AS SUBSCRIPTION

**I CREATED SNS TOPIC**
Topic
{
    "TopicArn": "arn:aws:sns:us-east-1:**********:billing-alarm"
}
**I ADDED SNS SUBSCRIBE**
    --topic-arn="arn:aws:sns:us-east-1:*********:billing-alarm" \
    --protocol=email \
    --notification-endpoint=#########@gmail.com
    
**I SETTUP ALARM WITH THE ALARM JSON SCRIPT IN aws_json FOLDER**
alarm_config.json
    aws cloudwatch put-metric-alarm --cli-input-json file://aws/json/alarm_config.json
