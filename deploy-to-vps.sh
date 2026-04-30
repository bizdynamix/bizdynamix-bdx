#!/bin/bash

###############################################################################
# BDX VPS Deployment Script
# Automates: code copy → install → build → services → nginx → SSL
# Usage: ./deploy-to-vps.sh YOUR_VPS_IP YOUR_OPENAI_API_KEY
###############################################################################

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
VPS_IP="${1:-}"
OPENAI_API_KEY="${2:-}"
APP_ROOT="/var/www/bizdynamix"
BACKEND_PORT=4000
FRONTEND_PORT=3000
SERVICE_NAME="bdx-mert-backend"
DOMAIN="bizdynamix.co.za"
WWW_DOMAIN="www.bizdynamix.co.za"

###############################################################################
# Helper functions
###############################################################################

print_header() {
    echo -e "\n${BLUE}=== $1 ===${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_step() {
    echo -e "${BLUE}→ $1${NC}"
}

# Check if running from correct directory
check_working_directory() {
    if [ ! -f "index.html" ] || [ ! -d "next-app" ] || [ ! -d "mert-backend" ]; then
        print_error "This script must be run from /Users/edwinbrooks/Projects/WEBSITES/BDX"
        exit 1
    fi
    print_success "Working directory verified"
}

# Validate inputs
validate_inputs() {
    if [ -z "$VPS_IP" ]; then
        print_error "VPS IP address required"
        echo "Usage: $0 YOUR_VPS_IP YOUR_OPENAI_API_KEY"
        exit 1
    fi
    
    if [ -z "$OPENAI_API_KEY" ]; then
        print_error "OpenAI API key required"
        echo "Usage: $0 YOUR_VPS_IP YOUR_OPENAI_API_KEY"
        exit 1
    fi
    
    print_success "All inputs provided"
}

# Test SSH connection
test_ssh() {
    print_step "Testing SSH connection to $VPS_IP..."
    if ssh -o ConnectTimeout=5 root@"$VPS_IP" "echo 'SSH connection successful'" > /dev/null 2>&1; then
        print_success "SSH connection established"
    else
        print_error "Cannot connect to VPS at $VPS_IP via SSH"
        print_warning "Ensure:"
        print_warning "  - VPS IP is correct"
        print_warning "  - SSH key is set up (ssh-copy-id root@$VPS_IP)"
        print_warning "  - VPS allows root SSH access"
        exit 1
    fi
}

# Deploy code to VPS
deploy_code() {
    print_header "Step 1: Deploy Code to VPS"
    
    print_step "Syncing project files to VPS..."
    rsync -avz \
        --exclude node_modules \
        --exclude .next \
        --exclude dist \
        --exclude .git \
        --exclude .env \
        --exclude '.env*' \
        . root@"$VPS_IP":"$APP_ROOT"/ || {
            print_error "rsync failed"
            exit 1
        }
    
    print_success "Code deployed to $APP_ROOT"
}

# Remote execution helper
run_remote() {
    ssh -T root@"$VPS_IP" "$@"
}

# Prepare VPS environment
prepare_vps() {
    print_header "Step 2: Prepare VPS Environment"
    
    print_step "Creating directories..."
    run_remote mkdir -p "$APP_ROOT" /var/log/bdx
    print_success "Directories created"
    
    print_step "Checking Node.js..."
    if run_remote command -v node > /dev/null 2>&1; then
        NODE_VERSION=$(run_remote node --version)
        print_success "Node.js $NODE_VERSION installed"
    else
        print_warning "Node.js not found, installing..."
        run_remote "curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs"
        print_success "Node.js installed"
    fi
    
    print_step "Checking nginx..."
    if run_remote command -v nginx > /dev/null 2>&1; then
        print_success "nginx installed"
    else
        print_warning "nginx not found, installing..."
        run_remote "apt-get update && apt-get install -y nginx"
        print_success "nginx installed"
    fi
}

# Install dependencies
install_dependencies() {
    print_header "Step 3: Install Dependencies"
    
    print_step "Installing backend dependencies..."
    run_remote "cd $APP_ROOT/mert-backend && npm install"
    print_success "Backend dependencies installed"
    
    print_step "Installing frontend dependencies..."
    run_remote "cd $APP_ROOT/next-app && npm install"
    print_success "Frontend dependencies installed"
}

# Build applications
build_apps() {
    print_header "Step 4: Build Applications"
    
    print_step "Building backend..."
    run_remote "cd $APP_ROOT/mert-backend && npm run build"
    print_success "Backend built"
    
    print_step "Building frontend..."
    run_remote "cd $APP_ROOT/next-app && npm run build"
    print_success "Frontend built"
}

# Configure environment
configure_env() {
    print_header "Step 5: Configure Environment"
    
    print_step "Creating backend .env..."
    run_remote "cat > $APP_ROOT/mert-backend/.env" << EOF
PORT=$BACKEND_PORT
OPENAI_API_KEY=$OPENAI_API_KEY
NODE_ENV=production
EOF
    print_success "Backend .env configured"
    
    print_step "Creating frontend .env.local..."
    run_remote "cat > $APP_ROOT/next-app/.env.local" << EOF
NEXT_PUBLIC_API_URL=https://$DOMAIN
NODE_ENV=production
EOF
    print_success "Frontend .env.local configured"
}

# Setup backend service
setup_backend_service() {
    print_header "Step 6: Setup Backend Service"
    
    print_step "Creating systemd service file..."
    run_remote "cat > /etc/systemd/system/${SERVICE_NAME}.service" << 'SERVICEEOF'
[Unit]
Description=BDX MERT Backend - AI Chat API
After=network.target

[Service]
Type=simple
WorkingDirectory=/var/www/bizdynamix/mert-backend
ExecStart=/usr/bin/node dist/server.js
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
Environment=NODE_ENV=production
Environment=PORT=4000
EnvironmentFile=/var/www/bizdynamix/mert-backend/.env
User=www-data
Group=www-data

[Install]
WantedBy=multi-user.target
SERVICEEOF
    
    print_success "Systemd service created"
    
    print_step "Starting backend service..."
    run_remote "systemctl daemon-reload && systemctl enable ${SERVICE_NAME}.service && systemctl start ${SERVICE_NAME}.service"
    print_success "Backend service started"
    
    print_step "Checking backend status..."
    run_remote "systemctl status ${SERVICE_NAME}.service --no-pager" || true
}

# Setup nginx
setup_nginx() {
    print_header "Step 7: Configure Nginx"
    
    print_step "Creating nginx site config..."
    run_remote "cat > /etc/nginx/sites-available/bdx" << 'NGINXEOF'
upstream bdx_backend {
    server 127.0.0.1:4000;
}

upstream bdx_frontend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    listen [::]:80;
    server_name bizdynamix.co.za www.bizdynamix.co.za;

    # Logs
    access_log /var/log/bdx/nginx-access.log;
    error_log /var/log/bdx/nginx-error.log;

    # API proxy
    location /api/ {
        proxy_pass http://bdx_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Chat widget
    location /chat-widget/ {
        alias /var/www/bizdynamix/chat-widget/;
        expires 1h;
        add_header Cache-Control "public, max-age=3600";
    }

    # Frontend
    location / {
        proxy_pass http://bdx_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINXEOF
    
    print_success "Nginx site config created"
    
    print_step "Enabling nginx site..."
    run_remote "ln -sf /etc/nginx/sites-available/bdx /etc/nginx/sites-enabled/bdx"
    print_success "Nginx site enabled"
    
    print_step "Testing nginx config..."
    if run_remote nginx -t > /dev/null 2>&1; then
        print_success "Nginx config valid"
    else
        print_error "Nginx config test failed"
        exit 1
    fi
    
    print_step "Reloading nginx..."
    run_remote "systemctl reload nginx"
    print_success "Nginx reloaded"
}

# Setup frontend service
setup_frontend_service() {
    print_header "Step 8: Setup Frontend Service"
    
    print_step "Creating frontend systemd service..."
    run_remote "cat > /etc/systemd/system/bdx-frontend.service" << 'FRONTENDEOF'
[Unit]
Description=BDX Next.js Frontend
After=network.target

[Service]
Type=simple
WorkingDirectory=/var/www/bizdynamix/next-app
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
User=www-data
Group=www-data
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
FRONTENDEOF
    
    print_success "Frontend service created"
    
    print_step "Starting frontend service..."
    run_remote "systemctl daemon-reload && systemctl enable bdx-frontend.service && systemctl start bdx-frontend.service"
    print_success "Frontend service started"
    
    print_step "Checking frontend status..."
    run_remote "systemctl status bdx-frontend.service --no-pager" || true
}

# Setup SSL
setup_ssl() {
    print_header "Step 9: Setup SSL/TLS (Let's Encrypt)"
    
    if run_remote command -v certbot > /dev/null 2>&1; then
        print_step "certbot found, requesting certificate..."
        run_remote "certbot --nginx -d $DOMAIN -d $WWW_DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN" || {
            print_warning "SSL setup failed (might need manual intervention)"
            return 1
        }
        print_success "SSL certificate installed"
    else
        print_warning "certbot not installed"
        print_step "Installing certbot..."
        run_remote "apt-get install -y certbot python3-certbot-nginx"
        print_step "Requesting certificate..."
        run_remote "certbot --nginx -d $DOMAIN -d $WWW_DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN" || {
            print_warning "SSL setup failed (might need manual intervention)"
            return 1
        }
        print_success "SSL certificate installed"
    fi
}

# Verify deployment
verify_deployment() {
    print_header "Step 10: Verify Deployment"
    
    print_step "Checking backend service..."
    if run_remote "systemctl is-active ${SERVICE_NAME}.service > /dev/null 2>&1"; then
        print_success "Backend service running"
    else
        print_error "Backend service not running"
        return 1
    fi
    
    print_step "Checking frontend service..."
    if run_remote "systemctl is-active bdx-frontend.service > /dev/null 2>&1"; then
        print_success "Frontend service running"
    else
        print_error "Frontend service not running"
        return 1
    fi
    
    print_step "Checking nginx..."
    if run_remote "systemctl is-active nginx.service > /dev/null 2>&1"; then
        print_success "Nginx running"
    else
        print_error "Nginx not running"
        return 1
    fi
    
    print_step "Testing backend API..."
    if run_remote "curl -s http://127.0.0.1:4000 | grep -q 'MERT backend active'"; then
        print_success "Backend API responding"
    else
        print_warning "Backend API test inconclusive"
    fi
    
    print_step "Checking logs..."
    print_warning "Backend errors (if any):"
    run_remote "journalctl -u ${SERVICE_NAME}.service -n 5 --no-pager" || true
}

# Print next steps
print_next_steps() {
    print_header "Deployment Complete!"
    
    echo -e "${GREEN}Your BDX deployment is ready!${NC}\n"
    
    echo "📋 Next Steps:"
    echo "  1. Update domain DNS A record to: $VPS_IP"
    echo "     - $DOMAIN → $VPS_IP"
    echo "     - $WWW_DOMAIN → $VPS_IP"
    echo ""
    echo "  2. Wait for DNS propagation (5-48 hours)"
    echo ""
    echo "  3. Visit https://$DOMAIN to verify"
    echo ""
    echo "📊 Monitoring:"
    echo "  Backend logs:"
    echo "    ssh root@$VPS_IP journalctl -u ${SERVICE_NAME}.service -f"
    echo ""
    echo "  Frontend logs:"
    echo "    ssh root@$VPS_IP journalctl -u bdx-frontend.service -f"
    echo ""
    echo "  Nginx logs:"
    echo "    ssh root@$VPS_IP tail -f /var/log/bdx/nginx-*.log"
    echo ""
    echo "🔧 Management:"
    echo "  Restart backend:"
    echo "    ssh root@$VPS_IP systemctl restart ${SERVICE_NAME}.service"
    echo ""
    echo "  Restart frontend:"
    echo "    ssh root@$VPS_IP systemctl restart bdx-frontend.service"
    echo ""
    echo "  Reload nginx:"
    echo "    ssh root@$VPS_IP systemctl reload nginx"
    echo ""
}

###############################################################################
# Main execution
###############################################################################

main() {
    print_header "BDX VPS Deployment Script"
    echo "VPS IP: $VPS_IP"
    echo "App Root: $APP_ROOT"
    echo "Domain: $DOMAIN"
    echo ""
    
    check_working_directory
    validate_inputs
    test_ssh
    
    deploy_code
    prepare_vps
    install_dependencies
    build_apps
    configure_env
    setup_backend_service
    setup_nginx
    setup_frontend_service
    setup_ssl
    verify_deployment
    print_next_steps
}

# Run main with error handling
if main; then
    print_success "Deployment completed successfully!"
    exit 0
else
    print_error "Deployment failed!"
    exit 1
fi
