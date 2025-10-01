#!/bin/sh

# Health check script for Coolify Hello World application
# This script checks if the application is responding correctly
# Exit codes: 0 = healthy, 1 = unhealthy

set -e

# Configuration
HOST="${HOSTNAME:-localhost}"
PORT="${PORT:-3000}"
HEALTH_ENDPOINT="/api/system"
TIMEOUT="${HEALTH_CHECK_TIMEOUT:-10}"
MAX_RETRIES="${HEALTH_CHECK_RETRIES:-3}"

# Colors for output (if terminal supports it)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') [HEALTHCHECK] $1"
}

# Check if curl is available, fallback to wget
check_http_client() {
    if command -v curl >/dev/null 2>&1; then
        HTTP_CLIENT="curl"
    elif command -v wget >/dev/null 2>&1; then
        HTTP_CLIENT="wget"
    else
        log "${RED}ERROR: Neither curl nor wget is available${NC}"
        exit 1
    fi
}

# Make HTTP request using curl
make_request_curl() {
    local url="$1"
    curl -f -s --max-time "$TIMEOUT" --connect-timeout 5 \
         -H "User-Agent: HealthCheck/1.0" \
         -H "Accept: application/json" \
         "$url" >/dev/null 2>&1
}

# Make HTTP request using wget
make_request_wget() {
    local url="$1"
    wget -q --timeout="$TIMEOUT" --tries=1 \
         --user-agent="HealthCheck/1.0" \
         --header="Accept: application/json" \
         -O /dev/null "$url" >/dev/null 2>&1
}

# Perform health check
health_check() {
    local url="http://${HOST}:${PORT}${HEALTH_ENDPOINT}"

    log "Checking application health at $url"

    case "$HTTP_CLIENT" in
        "curl")
            make_request_curl "$url"
            ;;
        "wget")
            make_request_wget "$url"
            ;;
    esac
}

# Main health check logic with retries
main() {
    local attempt=1
    local success=0

    # Check for HTTP client availability
    check_http_client

    # Attempt health check with retries
    while [ $attempt -le $MAX_RETRIES ]; do
        log "Health check attempt $attempt/$MAX_RETRIES"

        if health_check; then
            log "${GREEN}✓ Health check passed${NC}"
            success=1
            break
        else
            local exit_code=$?
            log "${YELLOW}⚠ Health check attempt $attempt failed (exit code: $exit_code)${NC}"

            if [ $attempt -lt $MAX_RETRIES ]; then
                log "Retrying in 2 seconds..."
                sleep 2
            fi
        fi

        attempt=$((attempt + 1))
    done

    if [ $success -eq 1 ]; then
        log "${GREEN}Application is healthy${NC}"
        exit 0
    else
        log "${RED}✗ Application health check failed after $MAX_RETRIES attempts${NC}"
        exit 1
    fi
}

# Handle script termination
trap 'log "Health check interrupted"; exit 1' INT TERM

# Run main function
main "$@"
