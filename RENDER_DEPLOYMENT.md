# 🚀 Deploying Synapse Mapper to Render

This guide will help you deploy your Synapse Mapper application to Render, a modern cloud platform for hosting web applications.

## 📋 Prerequisites

- A GitHub repository with your Synapse Mapper code
- A Render account (free tier available)
- Basic understanding of web applications

## 🏗️ Architecture Overview

Your deployment will consist of:
1. **Backend API** - Python FastAPI application (Docker container)
2. **Frontend** - React static site
3. **Database** - PostgreSQL database (provided by Render)

## 🚀 Step-by-Step Deployment

### 1. Prepare Your Repository

Make sure your repository contains all the files we've created:
- `Dockerfile` - For backend containerization
- `render.yaml` - Render configuration
- `production.env.example` - Environment variables template

### 2. Deploy to Render

#### Option A: Using Render Dashboard (Recommended)

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Sign in or create an account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your `empirica` repository

3. **Configure Backend Service**
   - **Name**: `synapse-mapper-api`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `./Dockerfile`
   - **Docker Context**: `.`
   - **Plan**: `Starter` (free tier)
   - **Region**: Choose closest to your users

4. **Set Environment Variables**
   ```
   API_HOST=0.0.0.0
   API_PORT=8000
   CORS_ORIGINS=https://your-frontend-url.onrender.com
   MAX_UPLOAD_SIZE_MB=50
   MAX_CONCURRENT_PROCESSING=2
   ENABLE_LLM_EXTRACTION=false
   ```

5. **Create Database**
   - Click "New +" → "PostgreSQL"
   - **Name**: `synapse-mapper-db`
   - **Plan**: `Starter` (free tier)
   - **Region**: Same as your backend

6. **Link Database to Backend**
   - In your backend service settings
   - Go to "Environment"
   - Add environment variable:
     - **Key**: `DATABASE_URL`
     - **Value**: Copy from your database's "Connections" tab

7. **Deploy Backend**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://synapse-mapper-api.onrender.com`)

8. **Deploy Frontend**
   - Click "New +" → "Static Site"
   - **Name**: `synapse-mapper-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Environment Variables**:
     - **Key**: `VITE_API_URL`
     - **Value**: Your backend URL (e.g., `https://synapse-mapper-api.onrender.com`)

#### Option B: Using render.yaml (Advanced)

If you prefer using the `render.yaml` file:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. **Deploy via Render Dashboard**
   - Go to Render Dashboard
   - Click "New +" → "Blueprint"
   - Connect your repository
   - Render will automatically detect and use your `render.yaml`

### 3. Configure Custom Domain (Optional)

1. **In Render Dashboard**
   - Go to your service settings
   - Click "Custom Domains"
   - Add your domain
   - Follow DNS configuration instructions

2. **Update CORS Settings**
   - Update `CORS_ORIGINS` in your backend environment variables
   - Include your custom domain

## 🔧 Environment Variables Reference

### Backend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `API_HOST` | Host for the API server | `0.0.0.0` | Yes |
| `API_PORT` | Port for the API server | `8000` | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Auto-generated | Yes |
| `CORS_ORIGINS` | Allowed CORS origins | `https://synapse-mapper-frontend.onrender.com` | Yes |
| `MAX_UPLOAD_SIZE_MB` | Maximum file upload size | `50` | No |
| `MAX_CONCURRENT_PROCESSING` | Max concurrent processing jobs | `2` | No |
| `ENABLE_LLM_EXTRACTION` | Enable AI features | `false` | No |
| `ANTHROPIC_API_KEY` | Anthropic API key for AI features | - | No |
| `LAVA_SECRET_KEY` | Lava Payments secret key | - | No |
| `LAVA_CONNECTION_SECRET` | Lava connection secret | - | No |
| `LAVA_PRODUCT_SECRET` | Lava product secret | - | No |
| `ENABLE_LAVA` | Enable Lava Payments | `false` | No |

### Frontend Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are in `requirements.txt`
   - Ensure Dockerfile is in the root directory
   - Check build logs in Render dashboard

2. **Database Connection Issues**
   - Verify `DATABASE_URL` is correctly set
   - Check database is running and accessible
   - Ensure database credentials are correct

3. **CORS Errors**
   - Update `CORS_ORIGINS` with your frontend URL
   - Check that URLs match exactly (including https/http)

4. **File Upload Issues**
   - Check `MAX_UPLOAD_SIZE_MB` setting
   - Verify file size limits in Render plan

5. **Memory Issues**
   - Reduce `MAX_CONCURRENT_PROCESSING`
   - Consider upgrading to a higher plan
   - Check for memory leaks in processing

### Performance Optimization

1. **Database Optimization**
   - Add database indexes for frequently queried fields
   - Use connection pooling
   - Monitor query performance

2. **File Storage**
   - Consider using external storage (AWS S3, etc.) for large files
   - Implement file cleanup for old uploads

3. **Caching**
   - Add Redis for session storage
   - Cache frequently accessed data

## 📊 Monitoring and Maintenance

### Health Checks

- **Backend**: `https://your-backend-url.onrender.com/`
- **Frontend**: `https://your-frontend-url.onrender.com`

### Logs

- View logs in Render dashboard
- Set up log aggregation for production
- Monitor error rates and performance

### Updates

1. **Code Updates**
   - Push changes to GitHub
   - Render will automatically redeploy
   - Monitor deployment status

2. **Database Migrations**
   - Run migrations through your application
   - Use Alembic for schema changes
   - Backup database before major changes

## 💰 Cost Considerations

### Free Tier Limits

- **Web Services**: 750 hours/month
- **Databases**: 1GB storage, 1GB bandwidth
- **Static Sites**: 100GB bandwidth

### Upgrading Plans

- **Starter**: $7/month per service
- **Standard**: $25/month per service
- **Pro**: $85/month per service

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit secrets to Git
   - Use Render's environment variable system
   - Rotate API keys regularly

2. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Regular backups

3. **API Security**
   - Implement rate limiting
   - Use HTTPS only
   - Validate all inputs

## 📞 Support

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **Render Support**: Available in paid plans
- **Community**: GitHub Issues for application-specific problems

## 🎉 You're Done!

Your Synapse Mapper application should now be live on Render! 

- **Backend URL**: `https://synapse-mapper-api.onrender.com`
- **Frontend URL**: `https://synapse-mapper-frontend.onrender.com`

Test your deployment by:
1. Visiting your frontend URL
2. Uploading a PDF file
3. Checking that the graph visualization works
4. Testing the chat functionality

Happy mapping! 🧬
