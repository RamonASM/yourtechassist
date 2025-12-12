#!/bin/bash
set -e

# Configuration
DEPLOY_PATH="/var/www/yourtechassist"
NGINX_CONF="/etc/nginx/sites-available/yourtechassist"
API_NAME="yta-api"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() { echo -e "${GREEN}[DEPLOY]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Check if running as root for nginx operations
check_root() {
    if [ "$EUID" -ne 0 ]; then
        warn "Not running as root. Nginx configuration will be skipped."
        return 1
    fi
    return 0
}

# Install dependencies
install_deps() {
    log "Installing dependencies..."
    cd "$DEPLOY_PATH"

    if command -v pnpm &> /dev/null; then
        pnpm install --frozen-lockfile
    else
        warn "pnpm not found, installing..."
        npm install -g pnpm
        pnpm install --frozen-lockfile
    fi
}

# Build all apps
build_apps() {
    log "Building applications..."
    cd "$DEPLOY_PATH"

    log "Building shared packages..."
    pnpm run build

    log "Build complete!"

    # Verify builds exist
    if [ ! -d "$DEPLOY_PATH/apps/marketing/dist" ]; then
        error "Marketing build not found at $DEPLOY_PATH/apps/marketing/dist"
    fi

    if [ ! -d "$DEPLOY_PATH/apps/client-portal/dist" ]; then
        error "Client portal build not found at $DEPLOY_PATH/apps/client-portal/dist"
    fi

    log "Static builds verified."
}

# Setup API with PM2
setup_api() {
    log "Setting up API with PM2..."

    if ! command -v pm2 &> /dev/null; then
        log "Installing PM2..."
        npm install -g pm2
    fi

    cd "$DEPLOY_PATH/apps/api"

    # Check if .env exists
    if [ ! -f ".env" ]; then
        warn ".env file not found in apps/api/"
        warn "Copy .env.example and configure it before the API will work properly."
    fi

    # Stop existing process if running
    pm2 delete "$API_NAME" 2>/dev/null || true

    # Start the API
    pm2 start "npx tsx src/index.ts" --name "$API_NAME" --cwd "$DEPLOY_PATH/apps/api"

    # Save PM2 process list
    pm2 save

    log "API started with PM2"
}

# Configure nginx
setup_nginx() {
    if ! check_root; then
        warn "Skipping nginx setup (requires root)"
        return
    fi

    log "Configuring nginx..."

    # Copy nginx config
    cp "$DEPLOY_PATH/nginx-yourtechassist.conf" "$NGINX_CONF"

    # Enable site
    ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/yourtechassist

    # Test nginx config
    if nginx -t; then
        log "Nginx config valid, reloading..."
        systemctl reload nginx
        log "Nginx reloaded successfully"
    else
        error "Nginx config test failed!"
    fi
}

# Health check
health_check() {
    log "Running health checks..."

    # Check API
    sleep 2
    if curl -s http://localhost:3001/health | grep -q "ok"; then
        log "API health check: OK"
    else
        warn "API health check failed - check logs with: pm2 logs $API_NAME"
    fi

    # Check static files
    if [ -f "$DEPLOY_PATH/apps/marketing/dist/index.html" ]; then
        log "Marketing static files: OK"
    else
        warn "Marketing static files not found"
    fi

    if [ -f "$DEPLOY_PATH/apps/client-portal/dist/index.html" ]; then
        log "Client portal static files: OK"
    else
        warn "Client portal static files not found"
    fi
}

# Main deployment
main() {
    log "Starting deployment to $DEPLOY_PATH"

    if [ ! -d "$DEPLOY_PATH" ]; then
        error "Deploy path $DEPLOY_PATH does not exist. Create it first or update DEPLOY_PATH in this script."
    fi

    install_deps
    build_apps
    setup_api
    setup_nginx
    health_check

    echo ""
    log "=========================================="
    log "Deployment complete!"
    log "=========================================="
    echo ""
    echo "Sites:"
    echo "  - https://yourtechassist.us (marketing)"
    echo "  - https://app.yourtechassist.us (client portal)"
    echo "  - https://api.yourtechassist.us (API)"
    echo ""
    echo "Useful commands:"
    echo "  pm2 logs $API_NAME    - View API logs"
    echo "  pm2 restart $API_NAME - Restart API"
    echo "  pm2 status            - Check PM2 processes"
    echo ""
}

# Handle command line args
case "${1:-}" in
    --build-only)
        install_deps
        build_apps
        ;;
    --api-only)
        setup_api
        health_check
        ;;
    --nginx-only)
        setup_nginx
        ;;
    --help)
        echo "Usage: $0 [option]"
        echo ""
        echo "Options:"
        echo "  (none)        Full deployment"
        echo "  --build-only  Only install deps and build"
        echo "  --api-only    Only restart API"
        echo "  --nginx-only  Only update nginx config"
        echo "  --help        Show this help"
        ;;
    *)
        main
        ;;
esac
