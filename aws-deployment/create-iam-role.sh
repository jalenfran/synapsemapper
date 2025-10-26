#!/bin/bash

echo "🔐 Creating IAM role for App Runner..."

# Create the App Runner instance role
aws iam create-role \
  --role-name AppRunnerInstanceRole \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "tasks.apprunner.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }' \
  --description "Role for App Runner instances to access AWS services"

# Attach necessary policies
aws iam attach-role-policy \
  --role-name AppRunnerInstanceRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

aws iam attach-role-policy \
  --role-name AppRunnerInstanceRole \
  --policy-arn arn:aws:iam::aws:policy/CloudWatchLogsFullAccess

echo "✅ IAM role created successfully!"
echo "   Role Name: AppRunnerInstanceRole"
echo "   Policies: S3FullAccess, CloudWatchLogsFullAccess"
