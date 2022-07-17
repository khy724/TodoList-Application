# TodoList-Application
## Requirements
  - node v16.15.1
  - npm v8.11.0
  - Angular version 13.3.7
  - serverless
## Technologies used for development
  - Angular
  - Nodejs
  - Expressjs
  - cron jobs
  - JWT access and refresh tokens
## Technologies used for deployment
  - AWS Cloud
  - serverless
  - Mongodb Atlas
  - boto3
### Cloud Services
  - AWS Lambda -uploaded nodejs backend as a Lambda function using serverless 
  - AWS S3 -hosted frontend using S3 bucket
  - AWS API Gateway -used to accomodate various routes 
  - AWS SES -used for email service for email verification using signup and to mail daily non-completed todos respectively to each active user.
## Steps to run project on your local machine
  - npm install
  - node index.js
  - ng serve --proxy-config proxy.conf.json
  
## Deployment
http://demo---deploy.s3-website.ap-south-1.amazonaws.com
