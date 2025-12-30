#!/bin/bash

# ============================================
# SwasthAI - Complete Deployment Script
# ============================================
# This script handles the complete deployment process
# Usage: bash deploy.sh [local|docker|aws]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✓${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
    exit 1
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# ============================================
# PHASE 1: VALIDATION
# ============================================
validate() {
    log "Starting validation..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
    fi
    success "Docker is installed"
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
    fi
    success "Docker Compose is installed"
    
    # Check if .env file exists
    if [ ! -f "backend/.env" ]; then
        error "backend/.env file not found. Please create it from .env.example"
    fi
    success "Environment file exists"
    
    # Check if docker daemon is running
    if ! docker ps > /dev/null 2>&1; then
        error "Docker daemon is not running. Please start Docker."
    fi
    success "Docker daemon is running"
    
    log "Validation complete!"
}

# ============================================
# PHASE 2: LOCAL DOCKER DEPLOYMENT
# ============================================
deploy_docker() {
    log "Starting Docker Compose deployment..."
    
    # Set environment
    export COMPOSE_FILE=docker-compose.yml
    
    log "Building images..."
    docker-compose build
    success "Images built successfully"
    
    log "Starting services..."
    docker-compose up -d
    success "Services started"
    
    log "Waiting for services to be healthy (30 seconds)..."
    sleep 30
    
    # Check health
    log "Checking service health..."
    
    if ! docker-compose exec -T postgres pg_isready -U ${DB_USER:-postgres} > /dev/null 2>&1; then
        error "PostgreSQL is not healthy"
    fi
    success "PostgreSQL is healthy"
    
    if ! docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
        error "Redis is not healthy"
    fi
    success "Redis is healthy"
    
    if ! curl -s http://localhost:5000/health > /dev/null 2>&1; then
        error "Backend API is not healthy"
    fi
    success "Backend API is healthy"
    
    log "Running database migrations..."
    docker-compose exec -T backend npm run migrate
    success "Migrations completed"
    
    log "Seeding database..."
    docker-compose exec -T backend npm run seed
    success "Database seeded"
    
    log ""
    log "============================================"
    success "Docker Deployment Complete!"
    log "============================================"
    echo ""
    echo "Services are running at:"
    echo "  Backend API:   http://localhost:5000"
    echo "  Frontend:      http://localhost:3000"
    echo "  PostgreSQL:    localhost:5432"
    echo "  Redis:         localhost:6379"
    echo "  PgAdmin:       http://localhost:5050"
    echo ""
    echo "To view logs: docker-compose logs -f"
    echo "To stop:      docker-compose down"
    echo ""
}

# ============================================
# PHASE 3: PRODUCTION DOCKER DEPLOYMENT
# ============================================
deploy_prod_docker() {
    log "Starting Production Docker Deployment..."
    
    # Check if production env file exists
    if [ ! -f ".env.production" ]; then
        error ".env.production file not found. Please create it with your production values."
    fi
    
    export COMPOSE_FILE=docker-compose.prod.yml
    export ENV_FILE=.env.production
    
    log "Building production images..."
    docker-compose build
    success "Images built successfully"
    
    log "Starting production services..."
    docker-compose --env-file "$ENV_FILE" up -d
    success "Production services started"
    
    log "Waiting for services to stabilize (60 seconds)..."
    sleep 60
    
    # Verify services
    log "Verifying services..."
    
    if ! docker-compose exec -T postgres pg_isready > /dev/null 2>&1; then
        error "PostgreSQL is not healthy"
    fi
    success "PostgreSQL is healthy"
    
    log ""
    success "Production Deployment Complete!"
    log "============================================"
}

# ============================================
# PHASE 4: AWS DEPLOYMENT PREPARATION
# ============================================
prepare_aws() {
    log "Preparing for AWS Deployment..."
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        error "AWS CLI is not installed. Please install it first."
    fi
    success "AWS CLI is installed"
    
    log "Checking AWS credentials..."
    if ! aws sts get-caller-identity > /dev/null 2>&1; then
        error "AWS credentials are not configured. Run: aws configure"
    fi
    success "AWS credentials are valid"
    
    log "Building Docker images for ECR..."
    
    # Get AWS account ID
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    AWS_REGION=${AWS_REGION:-ap-south-1}
    ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    
    log "AWS Account: $AWS_ACCOUNT_ID"
    log "AWS Region: $AWS_REGION"
    log "ECR Registry: $ECR_REGISTRY"
    
    # Create ECR repositories if they don't exist
    log "Creating ECR repositories..."
    
    aws ecr create-repository --repository-name swasthai-backend --region $AWS_REGION 2>/dev/null || true
    aws ecr create-repository --repository-name swasthai-frontend --region $AWS_REGION 2>/dev/null || true
    
    success "ECR repositories ready"
    
    # Login to ECR
    log "Logging in to ECR..."
    aws ecr get-login-password --region $AWS_REGION | \
        docker login --username AWS --password-stdin $ECR_REGISTRY
    success "Logged in to ECR"
    
    # Build and push images
    log "Building backend image..."
    docker build -f backend/Dockerfile -t $ECR_REGISTRY/swasthai-backend:latest .
    success "Backend image built"
    
    log "Pushing backend image to ECR..."
    docker push $ECR_REGISTRY/swasthai-backend:latest
    success "Backend image pushed"
    
    log "Building frontend image..."
    docker build -f frontend/Dockerfile \
        --build-arg VITE_API_BASE_URL=https://api.yourdomain.com \
        -t $ECR_REGISTRY/swasthai-frontend:latest ./frontend
    success "Frontend image built"
    
    log "Pushing frontend image to ECR..."
    docker push $ECR_REGISTRY/swasthai-frontend:latest
    success "Frontend image pushed"
    
    log ""
    success "AWS Deployment Preparation Complete!"
    log "============================================"
    echo ""
    echo "Next steps:"
    echo "1. Create RDS PostgreSQL database"
    echo "2. Create ElastiCache Redis cluster"
    echo "3. Create ECS cluster"
    echo "4. Create task definitions"
    echo "5. Create services"
    echo "6. Setup load balancer and auto-scaling"
    echo ""
}

# ============================================
# PHASE 5: HEALTH CHECK & TESTING
# ============================================
health_check() {
    log "Running health checks..."
    
    # Backend health check
    log "Checking backend health..."
    if curl -s http://localhost:5000/health | grep -q '"status":"OK"'; then
        success "Backend is healthy"
    else
        error "Backend health check failed"
    fi
    
    # API endpoint check
    log "Checking API endpoints..."
    if curl -s http://localhost:5000/api/v1 | grep -q "SwasthAI API"; then
        success "API endpoints are working"
    else
        error "API endpoints check failed"
    fi
    
    # Frontend check
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        success "Frontend is responding"
    else
        warning "Frontend is not responding (may still be building)"
    fi
    
    log ""
    success "Health checks complete!"
}

# ============================================
# PHASE 6: CLEANUP
# ============================================
cleanup() {
    log "Running cleanup..."
    
    # Remove dangling images
    docker image prune -f > /dev/null 2>&1 || true
    
    # Remove unused volumes
    docker volume prune -f > /dev/null 2>&1 || true
    
    success "Cleanup complete"
}

# ============================================
# MAIN EXECUTION
# ============================================

# Show usage
usage() {
    echo "Usage: bash deploy.sh [command]"
    echo ""
    echo "Commands:"
    echo "  local      - Deploy locally using Docker Compose"
    echo "  prod       - Deploy to production Docker environment"
    echo "  aws        - Prepare images and push to AWS ECR"
    echo "  validate   - Validate deployment prerequisites"
    echo "  health     - Run health checks"
    echo "  help       - Show this help message"
    echo ""
}

# Parse command
COMMAND=${1:-help}

case $COMMAND in
    local)
        validate
        deploy_docker
        health_check
        cleanup
        ;;
    prod)
        validate
        deploy_prod_docker
        health_check
        cleanup
        ;;
    aws)
        validate
        prepare_aws
        ;;
    validate)
        validate
        ;;
    health)
        health_check
        ;;
    help|*)
        usage
        ;;
esac
