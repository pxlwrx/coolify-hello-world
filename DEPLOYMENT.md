# 🚀 Coolify Deployment Guide

This guide will walk you through deploying the **Coolify Hello World - System Info Terminal** to your Coolify instance.

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ A running Coolify instance (v4.0+)
- ✅ Docker and Docker Compose installed locally (for testing)
- ✅ Git repository access (GitHub, GitLab, etc.)
- ✅ Basic understanding of Docker and containerization

## 🧪 Local Testing (Recommended)

Test the application locally before deploying to Coolify:

### Method 1: Docker Compose (Quick Test)

```bash
# Clone the repository
git clone <your-repo-url>
cd coolify-hello-world

# Test with local Docker Compose
docker-compose -f docker-compose.local.yml up -d

# Check if it's working
curl http://localhost:3000/api/system

# View in browser
open http://localhost:3000

# Clean up
docker-compose -f docker-compose.local.yml down
```

### Method 2: Development Mode

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Visit http://localhost:3000
```

## 🏗️ Coolify Deployment Methods

### Method 1: Docker Compose Deployment (Recommended)

This is the most reliable method for Coolify deployment.

1. **Create New Project in Coolify**
   - Log into your Coolify dashboard
   - Click "Create New Project"
   - Choose "Docker Compose"

2. **Configure the Project**
   - **Name**: `coolify-hello-world`
   - **Description**: `Terminal-style system information display`
   - **Docker Compose File**: Use the provided `docker-compose.yml`

3. **Set Environment Variables**
   ```env
   NODE_ENV=production
   PORT=3000
   HOSTNAME=0.0.0.0
   TZ=America/New_York  # Your timezone
   APP_URL=https://your-domain.com
   ```

4. **Configure Domain**
   - Add your domain: `hello-world.yourdomain.com`
   - Enable SSL/TLS certificates
   - Set up automatic HTTPS redirect

5. **Deploy**
   - Click "Deploy"
   - Monitor the deployment logs
   - Wait for the "Deployment successful" message

### Method 2: Git Repository Deployment

1. **Connect Repository**
   - Go to "Applications" in Coolify
   - Click "Add New Application"
   - Connect your Git repository
   - Select the `main` branch

2. **Build Configuration**
   - **Build Pack**: `dockerfile` or `nixpacks`
   - **Dockerfile Path**: `./Dockerfile`
   - **Port**: `3000`
   - **Root Directory**: `/`

3. **Environment Variables**
   ```env
   NODE_ENV=production
   PORT=3000
   HOSTNAME=0.0.0.0
   ```

4. **Deploy Settings**
   - Enable automatic deployments
   - Set deployment branch to `main`
   - Configure health checks

## ⚙️ Configuration Options

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Application environment |
| `PORT` | `3000` | Server port |
| `HOSTNAME` | `0.0.0.0` | Server bind address |
| `TZ` | `UTC` | Timezone for system info |
| `APP_URL` | `http://localhost:3000` | Application URL |
| `REFRESH_INTERVAL` | `5000` | Auto-refresh interval (ms) |
| `SHOW_ASCII_ART` | `true` | Show ASCII art header |

### Domain and SSL Configuration

1. **Add Domain**
   ```
   Primary: hello-world.yourdomain.com
   Aliases: system-info.yourdomain.com
   ```

2. **SSL Settings**
   - Enable automatic SSL certificates
   - Force HTTPS redirects
   - Use HTTP/2 when possible

### Resource Limits

Recommended resource allocation:

```yaml
resources:
  limits:
    memory: 512Mi
    cpu: 500m
  requests:
    memory: 128Mi
    cpu: 100m
```

## 🏥 Health Checks and Monitoring

The application includes built-in health checks:

### Health Check Endpoint
- **URL**: `/api/system`
- **Method**: `GET`
- **Expected Status**: `200`
- **Response**: JSON with system information

### Coolify Health Check Configuration
```yaml
healthcheck:
  test: ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:3000/api/system || exit 1"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Monitoring Endpoints

1. **System Info API**: `GET /api/system`
   - Returns comprehensive system information
   - Use for monitoring and alerting

2. **Application Status**: `GET /`
   - Web interface with real-time system stats
   - Visual health indicators

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Build Failures

**Problem**: "Module not found" errors during build

**Solution**:
```bash
# Ensure all dependencies are installed
npm install

# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

#### 2. Container Won't Start

**Problem**: Container exits immediately

**Solution**:
- Check Coolify logs for error messages
- Verify environment variables are set correctly
- Ensure port 3000 is not already in use

#### 3. Health Check Failures

**Problem**: Health checks failing

**Solution**:
```bash
# Test health check manually
curl -f http://localhost:3000/api/system

# Check container logs
docker logs <container-name>

# Verify internal networking
```

#### 4. API Returns Empty Data

**Problem**: System info API returns no data

**Solution**:
- Verify container has proper permissions
- Check if running in privileged mode is needed
- Review security contexts and capabilities

### Log Analysis

Check logs in Coolify dashboard:

1. **Build Logs**: Check for compilation errors
2. **Runtime Logs**: Monitor application startup
3. **Access Logs**: Verify incoming requests
4. **Error Logs**: Debug application issues

### Performance Issues

If the application is slow or unresponsive:

1. **Check Resource Usage**
   ```bash
   docker stats <container-name>
   ```

2. **Increase Resource Limits**
   ```yaml
   deploy:
     resources:
       limits:
         memory: 1Gi
         cpu: 1000m
   ```

3. **Monitor System Info API Response Time**
   ```bash
   curl -w "%{time_total}\n" -s -o /dev/null http://localhost:3000/api/system
   ```

## 🔄 Updates and Maintenance

### Updating the Application

1. **Git-based Deployment**:
   - Push changes to your repository
   - Coolify will automatically rebuild and deploy

2. **Manual Deployment**:
   - Upload new `docker-compose.yml`
   - Click "Redeploy" in Coolify dashboard

### Backup and Restore

The application is stateless, so no data backup is required. However, save your configuration:

1. **Export Configuration**
   - Download `docker-compose.yml`
   - Save environment variables
   - Document custom domain settings

2. **Restore Process**
   - Upload configuration files
   - Set environment variables
   - Deploy to new Coolify instance

## 🚨 Security Considerations

### Container Security

The application runs with security best practices:

- ✅ Non-root user execution
- ✅ Minimal privileges
- ✅ Read-only filesystem (where possible)
- ✅ Security options enabled

### Network Security

- ✅ Only port 3000 exposed
- ✅ HTTPS enforced (with domain)
- ✅ No sensitive data exposure

### API Security

- ✅ No authentication required (public system info)
- ✅ Rate limiting handled by Coolify/proxy
- ✅ No sensitive system data exposed

## 📊 Performance Benchmarks

Expected performance metrics:

- **Memory Usage**: 50-100MB
- **CPU Usage**: <5% during normal operation
- **Response Time**: <500ms for API calls
- **Startup Time**: 10-30 seconds

## 🎯 Production Checklist

Before going live, verify:

- [ ] Domain configured and SSL working
- [ ] Health checks passing
- [ ] Resource limits appropriate
- [ ] Timezone set correctly
- [ ] Monitoring enabled
- [ ] Backup configuration saved
- [ ] Security settings reviewed
- [ ] Performance tested under load

## 📞 Support and Resources

### Getting Help

1. **Check Logs**: Always start with Coolify deployment logs
2. **Test Locally**: Reproduce issues in local environment
3. **Documentation**: Review Next.js and Docker documentation
4. **Community**: Coolify Discord/GitHub discussions

### Useful Commands

```bash
# Check container status
docker ps | grep coolify-hello-world

# View real-time logs
docker logs -f coolify-hello-world-app

# Test API manually
curl -H "Accept: application/json" http://localhost:3000/api/system

# Check health
curl -f http://localhost:3000/api/system && echo "Healthy"
```

---

**🎉 Congratulations!** Your Coolify Hello World system info terminal should now be running successfully!

Visit your deployed application and enjoy the beautiful terminal-style system monitoring interface.