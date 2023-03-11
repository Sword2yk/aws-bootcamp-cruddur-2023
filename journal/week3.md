# Week 3 — Decentralized Authentication
## Required Homework

## Amazon Cognito

Amazon Cognito handles user authentication and authorization for your web and mobile apps. With user pools, you can easily and securely add sign-up and sign-in functionality to your apps. With identity pools (federated identities), your apps can get temporary credentials that grant users access to specific AWS resources, whether the users are anonymous or are signed in. <br>

### Creating a Cognito user pool
<ol>
<li>

  Logon [Amazon Cognito console](https://console.aws.amazon.com/cognito/home).If prompted, enter your AWS credentials.<br></li>
<li>  
Choose User Pools.<br></li>
<li>
Choose Create a user pool to start the user pool creation wizard. In the top-right corner of the page.<br></li>
<li>    
In Configure sign-in experience, choose the ```Cognito user pool``` options: ```Email```.<br></li>
<li>
In Configure security requirements, choose ```No MFA```, and ```Email only``` for Delivery method for user account recovery         messages.<br></li>
<li>
In Configure sign-up experience, determine how new users will verify their identities when signing up, and which attributes should be required or optional during the user sign-up flow. Required attribute (Additional required attributes) drop down menu select ```name``` and ```preferred_username```.</li>
<li>
In Configure message delivery, configure integration with Amazon Simple Email Service to send email to your users for sign-up, account confirmation and account recovery. Select the option ```Send email with Cognito``` .<br></li>
<li>
In Integrate your app, name your user pool, configure the hosted UI, and create an app client. Enter the User pool name and App client name.<br>  </li>
<li>  
Review your choices in the Review and create screen and modify any selections you wish to. When you are satisfied with your user pool configuration, select Create user pool to proceed.<br></li>
<li>
Result below.
Cognito User pools<br>
  
  ![User pools](week_3_assets/Amazon_cognito_user_pools.png) </li>
