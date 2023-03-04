# Week 2 — Homework Challenge (Observability)
# Distributed Tracing
Distributed tracing gives you insight into how a particular service is performing as part of the whole in a distributed software system (microservices system).<br>

## X-Ray Implementation

AWS X-Ray makes it easy for developers to analyze the behavior of their distributed applications by providing request tracing, exception collection, and profiling capabilities.

### X-Ray Implementation
I installed the required python package for X-Ray ``` aws-xray-sdk ``` from running 
``` pip install -r requirements.txt ``` in the backend-flask folder. <br>

Update my ``` app.py file ``` in the backend-flask folder with the python code below. <br>

import ```xray_recorder``` and ```XRayMiddleware``` from aws_xray package.

```XRayMiddleware``` provides the intereaction between the application with its segment.

    from aws_xray_sdk.core import xray_recorder
    from aws_xray_sdk.ext.flask.middleware import XRayMiddleware
   
    xray_url = os.getenv("AWS_XRAY_URL")
    xray_recorder.configure(service='Cruddur', dynamic_naming=xray_url)
    XRayMiddleware(app, xray_recorder)
    
Add a new .json file to json folder in aws dictionary for AWS X-Ray Resources.

AWS X-Ray Resources
![AWS X-Ray Resources](week_2_assets/xray_json.png) <br>

### AWS XRAY GROUP

Create AWS Xray group for collection of traces. I used below AWS CLI command ```aws xray create-group``` <br>
Group name 'Crudder' <br>
Service 'backend-flask' <br>

    aws xray create-group \
       --group-name "Cruddur" \
       --filter-expression "service(\"backend-flask\") {fault OR error}"

X-ray Traces - Group
![Xray group](week_2_assets/x-ray%20group.PNG)

### AWS XRAY SAMPLING RULE

A sampling rule specifies which requests X-Ray should record for your API. By customizing sampling rules, you can control the amount of data that you record, and modify sampling behavior on the fly without modifying or redeploying your code.<br>
Run below sampling rule script on AWS CLI to create a sampling rule.

    aws xray create-sampling-rule --cli-input-json file://aws/json/xray.json

AWS X-Ray Traces - Sampling Rule
![X-Ray sampling rule](week_2_assets/sampling%20rule.PNG)
