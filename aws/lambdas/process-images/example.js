{
  "Records" [
      {
          "eventVersion": "2.1",
          "eventSource": "aws:s3",
          "awsRegion": "us-east-1",
          "eventTime": "2023-04-04T12:34:56.000Z",
          "eventName": "ObjectCreated:Put",
          "userIdentity": {
              "principalId": "EXAMPLE"
          },
          "requestParameters": {
              "sourceIPAddress": "127.0.0.1"
          },
          "responseElements": {
              "x-amz-request-id": "EXAMPLE123456789",
              "x-amz-id-2": "EXAMPLE123/abcdefghijklmno/123456789"
          },
          "s3": {
              "s3SchemaVersion": "1.0",
              "configurationId": "EXAMPLEConfig",
              "bucket": {
                  "name": "assets.obi-aws-bootcamp.space",
                  "ownerIdentity": {
                      "principalId": "EXAMPLE"
                  },
                  "arn": "arn:aws:s3:::assets.obi-aws-bootcamp.space"
              },
              "object": {
                  "key": "avatars/original/data.jpg",
                  "size": 1024,
                  "eTag": "EXAMPLEETAG",
                  "sequencer": "EXAMPLESEQUENCER"
              }
          }
      }
  ]
}