"""
Vercel serverless function entry point for FastAPI backend
"""
import os
import sys
from pathlib import Path

# Add the backend directory to Python path
backend_path = Path(__file__).parent.parent
sys.path.insert(0, str(backend_path))

from mangum import Mangum
from app.main import app

# Create the ASGI handler for Vercel
handler = Mangum(app, lifespan="off")

# For Vercel, we need to handle the request
def lambda_handler(event, context):
    return handler(event, context)
 