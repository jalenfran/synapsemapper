# Vercel Deployment Guide for Empirica

This guide will help you deploy your Empirica application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. Environment variables configured

## Deployment Steps

### 1. Connect Repository to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect the project structure

### 2. Configure Project Settings

In the Vercel dashboard, configure the following settings:

#### Framework Settings
- **Framework Preset**: FastAPI (for backend)
- **Root Directory**: Leave empty (root of repository)
- **Build Command**: `pip install -r backend/requirements.txt`
- **Output Directory**: `frontend/dist`

#### Environment Variables
Add the following environment variables in your Vercel project settings:

```
# Database Configuration
DATABASE_URL=your_postgresql_connection_string
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=false

# CORS Configuration
CORS_ORIGINS=["https://your-domain.vercel.app"]

# LLM Configuration (if using)
ANTHROPIC_API_KEY=your_anthropic_api_key
ENABLE_LLM_EXTRACTION=true

# SciSpacy Model
SCISPACY_MODEL=en_core_sci_sm

# JWT Configuration
JWT_SECRET_KEY=your_jwt_secret_key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Vite Google OAuth Client ID (for frontend)
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id

# PubMed API (if using)
PUBMED_API_KEY=your_pubmed_api_key
```

### 3. Database Setup

Since Vercel doesn't provide persistent storage, you'll need an external database:

#### Option 1: PostgreSQL (Recommended)
- Use services like [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app)
- Get your connection string and add it as `DATABASE_URL`

#### Option 2: SQLite (Not recommended for production)
- For development/testing only
- Files are not persistent on Vercel

### 4. File Storage

For file uploads and processing, you'll need external storage:

#### Option 1: AWS S3
```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BUCKET_NAME=your_bucket_name
AWS_REGION=your_region
```

#### Option 2: Cloudinary
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 5. Deploy

1. Click "Deploy" in Vercel dashboard
2. Wait for the build to complete
3. Your app will be available at `https://your-project.vercel.app`

## Project Structure

The deployment uses this structure:
```
/
├── vercel.json                 # Vercel configuration
├── backend/
│   ├── api/
│   │   └── index.py           # Vercel serverless function entry point
│   ├── app/
│   │   └── main.py            # FastAPI application
│   └── requirements.txt       # Python dependencies
└── frontend/
    ├── package.json           # Node.js dependencies
    ├── vite.config.ts         # Vite configuration
    └── dist/                  # Built frontend (generated)
```

## Important Notes

### Limitations
1. **File Uploads**: Vercel has a 50MB limit for serverless functions
2. **Processing Time**: Functions timeout after 30 seconds (Pro plan: 60 seconds)
3. **Memory**: Limited to 1GB RAM per function
4. **Storage**: No persistent file system

### Recommendations
1. Use external storage for uploaded files
2. Implement async processing for large files
3. Consider using Vercel Pro for longer timeouts
4. Use a CDN for static assets

### Troubleshooting

#### Build Failures
- Check that all dependencies are in `requirements.txt`
- Ensure Python version compatibility
- Verify file paths in `vercel.json`

#### Runtime Errors
- Check environment variables are set correctly
- Verify database connection string
- Check function logs in Vercel dashboard

#### CORS Issues
- Update `CORS_ORIGINS` with your Vercel domain
- Ensure frontend and backend are on same domain

## Environment-Specific Configuration

### Development
```bash
# Local development
npm run dev          # Frontend
uvicorn app.main:app # Backend
```

### Production
- All configuration through Vercel environment variables
- Automatic deployments on Git push
- Built-in CDN and edge functions

## Monitoring

1. **Vercel Dashboard**: View deployments, logs, and analytics
2. **Function Logs**: Check serverless function execution
3. **Performance**: Monitor response times and errors

## Security Considerations

1. **Environment Variables**: Never commit secrets to Git
2. **CORS**: Configure allowed origins properly
3. **Authentication**: Use secure JWT secrets
4. **Database**: Use connection pooling and SSL
5. **File Uploads**: Validate file types and sizes

## Scaling

- Vercel automatically scales serverless functions
- Consider database connection pooling
- Use caching for frequently accessed data
- Monitor function cold starts

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
