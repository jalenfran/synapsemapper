# 🚀 AWS Deployment Guide for Empirica

## Easiest Option: AWS App Runner

This is the **simplest** way to deploy your full-stack Empirica application to AWS. It handles both frontend and backend automatically.

## Prerequisites

1. **AWS Account** - Sign up at [aws.amazon.com](https://aws.amazon.com)
2. **AWS CLI** - Install from [AWS CLI docs](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
3. **Docker** - Install from [Docker docs](https://docs.docker.com/get-docker/)
4. **GitHub Repository** - Push your code to GitHub

## Quick Start (3 Steps)

### Step 1: Prepare Your Repository

1. Push your code to GitHub:
```bash
git add .
git commit -m "Add AWS deployment configuration"
git push origin main
```

2. Update the repository URL in `deploy.sh`:
```bash
# Edit this line in deploy.sh:
REPOSITORY_URL="https://github.com/YOUR_USERNAME/empirica.git"
```

### Step 2: Configure AWS

1. Install AWS CLI and configure:
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key  
# Enter your region (e.g., us-east-1)
# Enter output format (json)
```

2. Create an IAM role for App Runner:
```bash
# Create the role (replace YOUR_ACCOUNT_ID with your actual account ID)
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
  }'
```

### Step 3: Deploy

Run the deployment script:
```bash
cd aws-deployment
./deploy.sh
```

That's it! 🎉 Your application will be deployed and accessible via a public URL.

## What This Does

- **Deploys both frontend and backend** in one service
- **Automatically scales** based on traffic
- **Handles SSL certificates** automatically
- **Auto-deploys** when you push to GitHub
- **Costs ~$25-50/month** for typical usage

## Environment Variables

Set these in your GitHub repository secrets or AWS Systems Manager:

```bash
# Required for AI features
ANTHROPIC_API_KEY=your_anthropic_key
LAVA_SECRET_KEY=your_lava_key
LAVA_CONNECTION_SECRET=your_connection_secret
LAVA_PRODUCT_SECRET=your_product_secret
ENABLE_LAVA=true

# Database (App Runner will create this automatically)
DATABASE_URL=postgresql://postgres:password@db:5432/empirica
```

## Alternative: Even Easier with Docker Compose

If you want to test locally first:

```bash
# Run locally
docker-compose up

# Your app will be at:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

## Monitoring

- **AWS Console**: Go to App Runner service in AWS Console
- **Logs**: Available in CloudWatch Logs
- **Metrics**: CPU, Memory, Request count in CloudWatch

## Cost Estimate

- **App Runner**: ~$25-50/month (1 vCPU, 2GB RAM)
- **Database**: ~$15-30/month (RDS PostgreSQL)
- **Total**: ~$40-80/month

## Troubleshooting

### Common Issues

1. **Build fails**: Check Docker logs in App Runner console
2. **Database connection**: Ensure DATABASE_URL is set correctly
3. **API not accessible**: Check CORS settings in backend

### Useful Commands

```bash
# Check service status
aws apprunner describe-service --service-arn YOUR_SERVICE_ARN

# View logs
aws logs describe-log-groups --log-group-name-prefix /aws/apprunner

# Update service
aws apprunner update-service --service-arn YOUR_SERVICE_ARN
```

## Next Steps

1. **Custom Domain**: Add your own domain in App Runner settings
2. **Database**: Migrate to RDS for production
3. **CDN**: Add CloudFront for better performance
4. **Monitoring**: Set up CloudWatch alarms

## Support

- **AWS App Runner Docs**: https://docs.aws.amazon.com/apprunner/
- **Docker Compose Docs**: https://docs.docker.com/compose/
- **Empirica Issues**: Create an issue in your GitHub repository
