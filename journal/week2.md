# Week 2 — Required Homework Observability
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
<br>
Run below sampling rule script on AWS CLI to create a sampling rule via API.

    aws xray create-sampling-rule --cli-input-json file://aws/json/xray.json

AWS X-Ray Traces - Sampling Rule
![X-Ray sampling rule](week_2_assets/sampling%20rule.PNG)

### X-Ray daemon on Amazon ECS
The AWS X-Ray daemon is a software application that listens for traffic on UDP port 2000, gathers raw segment data, and relays it to the AWS X-Ray API.<br>

Create a Docker image that runs the X-Ray daemon, upload it to a Docker image repository, and then deploy my Amazon ECS cluster.
Steps:
Add below Deamon Service to Docker Compose.

    xray-daemon:
    image: "amazon/aws-xray-daemon"
    environment:
      AWS_ACCESS_KEY_ID: "${AWS_ACCESS_KEY_ID}"
      AWS_SECRET_ACCESS_KEY: "${AWS_SECRET_ACCESS_KEY}"
      AWS_REGION: "us-east-1"
    command:
      - "xray -o -b xray-daemon:2000"
    ports:
      - 2000:2000/udp
 
Update AWS X-RAY Docker compose environment ```docker-compose.yml```.
 
    AWS_XRAY_URL: "*4567-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}*"
    AWS_XRAY_DAEMON_ADDRESS: "xray-daemon:2000"

X-Ray daemon in the docker compose file.
![](week_2_assets/Xray-daemon.png)

### AWS X-Ray daemon Docker logs
Docker logs for AWS X-Ray daemon.<br>
Sucessfully sending traces to AWS X-Ray via the API.

![Docker logs for AWS X-Ray daemon ](week_2_assets/X-ray_logs.PNG)

### AWS X-Ray segment
A trace segment records information about the original request, information about the work that your application does locally, and subsegments with information about downstream calls that your application makes to AWS resources, HTTP APIs, and SQL databases.<br>

X-Ray segment for backend-flask app
![X-Ray segment](week_2_assets/X-ray-Segment%20details.PNG)

### AWS X-Ray subsegment
Subsegments provide more granular timing information and details about downstream calls that the application made to fulfill the original request.
![](week_2_assets/X-ray-Subsegment.png)

## HoneyComb
Instrumentation of Flask app with OpenTelemetry for easy observability.<br>
Created a trial account at honeycomb.io<br>
Created a new enviroment and attained the api key.<br>
Persisted the API key to ```docker-compose.yml``` file.<br>

    $ gp env HONEYCOMB_API_KEY="<API Key>"
    HONEYCOMB_API_KEY="<API Key>"
    
Add below to instrument a Flask app with OpenTelemetry in the ```requirements.txt```.

        opentelemetry-api
        opentelemetry-sdk
        opentelemetry-exporter-otlp-proto-http
        opentelemetry-instrumentation-flask
        opentelemetry-instrumentation-requests

Run ```pip install -r requirements.txt``` to install the dependencies.

    ....backend-flask\pip install -r requirements.txt

Add below in the ```app.py``` file.
Tracing and importing instrumentation packages.

    from opentelemetry import trace
    from opentelemetry.instrumentation.flask import FlaskInstrumentor
    from opentelemetry.instrumentation.requests import RequestsInstrumentor
    from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
    from opentelemetry.sdk.trace import TracerProvider
    from opentelemetry.sdk.trace.export import BatchSpanProcessor
    from opentelemetry.sdk.trace.export import ConsoleSpanExporter, SimpleSpanProcessor

Initialize tracing and an exporter that can send data to Honeycomb.

    provider = TracerProvider()
    processor = BatchSpanProcessor(OTLPSpanExporter())
    provider.add_span_processor(processor)
    trace.set_tracer_provider(provider)
    tracer = trace.get_tracer(__name__)

Initialize automatic instrumentation with Flask.

    app = flask.Flask(__name__)
    FlaskInstrumentor().instrument_app(app)
    RequestsInstrumentor().instrument()

Add below to the environment variables to backend-flask in docker compose ```docker-compose.yml``` file.

    OTEL_EXPORTER_OTLP_ENDPOINT: "https://api.honeycomb.io"
    OTEL_EXPORTER_OTLP_HEADERS: "x-honeycomb-team=${HONEYCOMB_API_KEY}"
    OTEL_SERVICE_NAME: "backend-flask"
  
  ### SPINNING: Sending traces to honeycomb.io

            "name": "/api/activities/home",
            "context": {
                "trace_id": "0x1519da519fa47d493dc03df46b542988",
                "span_id": "0xbfd4cfa758e44146",
                "trace_state": "[]"
            },
            "kind": "SpanKind.SERVER",
            "parent_id": null,
            "start_time": "2023-03-04T14:01:40.599940Z",
            "end_time": "2023-03-04T14:01:40.601739Z",
            "status": {
                "status_code": "UNSET"

![](week_2_assets/spinning_honeycomb.png)

### Traces on honeycomb
Traces collected on honeycomb.io via api ENDPOINT and HEADERS.

Honeycomb Traces
![honeycomb Traces](week_2_assets/honeycomb_traces_2.PNG)

Search span
![](week_2_assets/honeycomb_traces.PNG)

Queries for Latency.
Latency
![Latency](week_2_assets/honeycomb_latency_heatmap.PNG)


## Amazon CloudWatch Logs
Amazon CloudWatch Logs lets you monitor and troubleshoot your systems and applications using your existing system, application and custom log files.

Add cloudwatch python package ```watchtower```to my ```requirements.txt``` file.

Run ``` pip install -r requirements.txt ``` in the backend-flask directory.

Update ``` app.py ``` file with the code below.
    
    #Import watchtower packages
    import watchtower
    import logging
    from time import strftime
 
    #Logger configuration for CloudWatch
    LOGGER = logging.getLogger(__name__)
    LOGGER.setLevel(logging.DEBUG)
    console_handler = logging.StreamHandler()
    cw_handler = watchtower.CloudWatchLogHandler(log_group='cruddur')
    LOGGER.addHandler(console_handler)
    LOGGER.addHandler(cw_handler)
    LOGGER.info("test log")
  
     @app.after_request
       def after_request(response):
       timestamp = strftime('[%Y-%b-%d %H:%M]')
       LOGGER.error('%s %s %s %s %s %s', timestamp, request.remote_addr, request.method, request.scheme, request.full_path, response.status)
       return response

Add below envirnoment variables to the ```docker-compose.yml``` file.

      AWS_DEFAULT_REGION: "${AWS_DEFAULT_REGION}"
      AWS_ACCESS_KEY_ID: "${AWS_ACCESS_KEY_ID}"
      AWS_SECRET_ACCESS_KEY: "${AWS_SECRET_ACCESS_KEY}"
     
### AWS CloudWatch Log

CloudWatch Log via API Call.
![CloudWatch Log](week_2_assets/CloudWatch_Log_events.PNG)

CloudWatch Streams.
![Streams](week_2_assets/Cruddur_Log_details.PNG)
  
## Rollbar
Rollbar is a hosted monitoring service that can be used with Python web applications to catch and report errors.<br>
Add below python packages to ```requirements.txt```

    blinker
    rollbar
install rollbar python packages with Run ``` pip install -r requirements.txt ``` in the backend-flask directory.

Add below to the python file ```app.py``` in the backend-flask directory.
#Import rollbar python packages

    import rollbar
    import rollbar.contrib.flask
    from flask import got_request_exception
    
     rollbar_access_token = os.getenv('ROLLBAR_ACCESS_TOKEN')
    @app.before_first_request
    def init_rollbar():
        """init rollbar module"""
        rollbar.init(
            # access token
            rollbar_access_token,
            # environment name
            'production',
            # server root directory, makes tracebacks prettier
            root=os.path.dirname(os.path.realpath(__file__)),
            # flask already sets up logging
            allow_logging_basic_config=False)

    # send exceptions from `app` to rollbar, using flask's signal system.
    got_request_exception.connect(rollbar.contrib.flask.report_exception, app)
    
Add below rollbar access token variable to the ```docker-compose.yml``` file.

    ROLLBAR_ACCESS_TOKEN: "${ROLLBAR_ACCESS_TOKEN}"

### Set the access token for rollbar
 
    export ROLLBAR_ACCESS_TOKEN=""
    gp env ROLLBAR_ACCESS_TOKEN=""

Add endpoint for testing on ```app.py``` in the backend-flask directory.

    # Rollbar ----
    @app.route('/rollbar/test')
    def rollbar_test():
        rollbar.report_message('Hello World!', 'warning')
        return "Hello World!"
 
 ### Rollbar testing
 Rollbar test page.
 ![Test Page](week_2_assets/Rollbar_test_page.PNG)
 
 Rollbar monitoring host
 ![monitoring](week_2_assets/Rollbar_hello_test.PNG)
 
## Reference
<ol>
<li>
     
[AWS-xray-daemon Github](https://github.com/aws/aws-xray-daemon)
    
</li>

<li>
        
[AWS-xray-daemon with ECS](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon-ecs.html)
    
</li>

 <li>
        
 [HoneyComb](https://docs.honeycomb.io/getting-data-in/opentelemetry/python/)
        
 </li>
 
 <li>
          
 [Rollbar](https://docs.rollbar.com/docs)
          
 </li>
 </ol>
