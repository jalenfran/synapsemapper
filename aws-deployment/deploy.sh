#!/bin/bash

# AWS App Runner Deployment Script for Empirica
# This is the EASIEST way to deploy your full-stack application

set -e

echo "🚀 Deploying Empirica to AWS App Runner..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first:"
    echo "   https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install it first:"
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

# Set variables
REGION="us-east-1"
SERVICE_NAME="empirica-app"
REPOSITORY_URL="https://github.com/farhan/empirica.git"  # Replace with your GitHub repo

echo "📋 Configuration:"
echo "   Region: $REGION"
echo "   Service Name: $SERVICE_NAME"
echo "   Repository: $REPOSITORY_URL"

# Create App Runner service configuration
cat > apprunner-service-config.json << EOF
{
  "ServiceName": "$SERVICE_NAME",
  "SourceConfiguration": {
    "Repository": {
      "RepositoryUrl": "$REPOSITORY_URL",
      "SourceCodeVersion": {
        "Type": "BRANCH",
        "Value": "main"
      }
    },
    "AutoDeploymentsEnabled": true
  },
  "InstanceConfiguration": {
    "Cpu": "1 vCPU",
    "Memory": "2 GB",
    "InstanceRoleArn": "arn:aws:iam::YOUR_ACCOUNT_ID:role/AppRunnerInstanceRole"
  },
  "HealthCheckConfiguration": {
    "Protocol": "HTTP",
    "Path": "/",
    "Interval": 10,
    "Timeout": 5,
    "HealthyThreshold": 2,
    "UnhealthyThreshold": 5
  }
}
EOF

echo "📝 Created App Runner service configuration"

# Deploy using AWS CLI
echo "🚀 Creating App Runner service..."

aws apprunner create-service \
  --region $REGION \
  --cli-input-json file://apprunner-service-config.json

echo "✅ App Runner service created successfully!"
echo ""
echo "🔗 Your application will be available at:"
echo "   https://$SERVICE_NAME-$(aws sts get-caller-identity --query Account --output text).us-east-1.awsapprunner.com"
echo ""
echo "📊 To monitor your service:"
echo "   aws apprunner describe-service --service-arn arn:aws:apprunner:$REGION:$(aws sts get-caller-identity --query Account --output text):service/$SERVICE_NAME"
echo ""
echo "🛠️  To update your service:"
echo "   Just push to your GitHub repository - App Runner will auto-deploy!"
