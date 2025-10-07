# Coolify 404 Error Debugging Guide

This guide helps you systematically troubleshoot 404 errors when deploying Next.js applications to Coolify.

## Quick Diagnostic Checklist

When you get a 404 error, check these items first:

- [ ] **Application Status**: Is the application showing "Running" in Coolify?
- [ ] **Health Checks**: Are health checks passing (green status)?
- [ ] **Container Logs**: Any error messages in the application logs?
- [ ] **Domain Configuration**: Is the domain correctly configured and pointing to Coolify?
- [ ] **Build Success**: Did the Docker build complete successfully?

## Step-by-Step Debugging Process

### Step 1: Verify Application is Running

```bash
# Check if the container is running
docker ps | grep your-container-name

# Check container logs
docker logs your-container-name --tail 50
```

**What to look for:**
- Container should be in "Up" status
- No fatal errors in startup logs
- Should see "Ready in Xms" from Next.js
- No port binding errors

### Step 2: Test Health Endpoints Directly

Test the health endpoint to verify the application is responding:

```bash
# Test health endpoint (replace with your domain)
curl -v https://system.pxlwrx.de/api/health

# Test debug endpoint for detailed info
curl -v https://system.pxlwrx.de/api/debug
```

**Expected responses:**
- **Health**: `{"status":"healthy","timestamp":"..."}`
- **Debug**: Detailed environment and diagnostic information

### Step 3: Check Container Network Access

If health endpoints fail, test container directly:

```bash
# Get container ID
docker ps | grep your-app-name

# Test from inside the container
docker exec -it <container-id> wget -qO- http://localhost:3000/api/health

# Test from host to container
docker inspect <container-id> | grep IPAddress
curl http://<container-ip>:3000/api/health
```

### Step 4: Examine Proxy Configuration

Check if the issue is with the reverse proxy setup:

```bash
# Check Traefik/Caddy labels in the running container
docker inspect <container-id> | jq '.Config.Labels'

# Look for networking issues
docker network ls
docker network inspect <network-name>
```

## Common Causes and Solutions

### 1. Application Not Binding to 0.0.0.0

**Problem**: Next.js binds to localhost only, making it unreachable from outside container

**Solution**: Add to Dockerfile
```dockerfile
ENV HOSTNAME=0.0.0.0
```

**Verification**: Check debug endpoint shows `"hostname": "0.0.0.0"`

### 2. Proxy Configuration Conflicts

**Problem**: Mixed Traefik and Caddy labels causing routing conflicts

**Symptoms**: 
- Application runs but 404 on domain
- Health checks pass but main app unreachable
- Works via container IP but not domain

**Solution**: In Coolify, ensure only one proxy type is configured

### 3. Network Isolation Issues

**Problem**: Container can't be reached by reverse proxy

**Symptoms**:
- Container healthy but domain returns 404
- Direct container access works
- Proxy can't reach container

**Solution**: 
- Verify container is on correct network
- Check network configuration in Coolify
- Restart the deployment

### 4. Next.js Build Issues

**Problem**: Next.js build doesn't create proper standalone server

**Symptoms**:
- Build succeeds but server.js missing
- Static files not found
- Application starts but routes don't work

**Solution**: Verify `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // ... other config
};
module.exports = nextConfig;
```

### 5. Port Configuration Mismatch

**Problem**: Application runs on different port than expected

**Symptoms**:
- Health checks fail
- Container starts but unreachable
- Wrong port in logs

**Solution**: Ensure consistent port configuration:
- Dockerfile: `ENV PORT=3000`
- docker-compose: `ports: ["3000:3000"]`
- Coolify: Port set to 3000

### 6. DNS/Domain Issues

**Problem**: Domain doesn't resolve to Coolify server

**Symptoms**:
- DNS lookup fails
- SSL certificate issues
- Domain works for other services but not this one

**Solutions**:
```bash
# Check DNS resolution
nslookup system.pxlwrx.de

# Check if domain reaches Coolify server
curl -H "Host: system.pxlwrx.de" http://your-coolify-server-ip

# Check SSL certificate
curl -vI https://system.pxlwrx.de
```

## Using the Debug Endpoint

Access `https://your-domain.com/api/debug` for detailed diagnostic information:

### Key Debug Information to Check:

1. **Environment Variables**:
   ```json
   {
     "nodeEnv": "production",
     "port": "3000",
     "hostname": "0.0.0.0",
     "coolifyUrl": "http://system.pxlwrx.de",
     "serviceFqdnApp": "system.pxlwrx.de"
   }
   ```

2. **Request Information**:
   ```json
   {
     "host": "system.pxlwrx.de",
     "userAgent": "...",
     "forwardedFor": "...",
     "realIp": "..."
   }
   ```

3. **Diagnostics**:
   ```json
   {
     "hasCorrectPort": true,
     "hasHostname": true,
     "hasCoolifyVars": true,
     "hostMatches": true
   }
   ```

### Debug Endpoint Red Flags:

- ❌ `"hasCorrectPort": false` - Port configuration issue
- ❌ `"hasHostname": false` - Application binding issue  
- ❌ `"hasCoolifyVars": false` - Not running in Coolify environment
- ❌ `"hostMatches": false` - Proxy/domain mismatch

## Coolify-Specific Troubleshooting

### Check Coolify Application Status

1. **Application Overview**:
   - Status should be "Running" (green)
   - Health checks should be passing
   - No recent restart loops

2. **Build Logs**:
   - Build should complete successfully
   - No errors in npm install/build process
   - Docker image created successfully

3. **Runtime Logs**:
   - Application starts without errors
   - Next.js shows "Ready in Xms"
   - No port binding failures

### Common Coolify Configuration Issues

1. **Wrong Health Check URL**:
   - Should be `/api/health` not `/api/system`
   - Method should be GET
   - Port should be 3000

2. **Domain Configuration**:
   - Domain correctly added to application
   - SSL certificate generated
   - DNS pointing to Coolify server

3. **Environment Variables**:
   - Don't override PORT unless necessary
   - Ensure NODE_ENV=production
   - Add any app-specific variables

## Advanced Debugging

### Container Deep Dive

```bash
# Get detailed container info
docker inspect <container-id>

# Check resource usage
docker stats <container-id>

# Shell into container
docker exec -it <container-id> /bin/sh

# Inside container, test application
wget -qO- http://localhost:3000/
wget -qO- http://localhost:3000/api/health
```

### Network Analysis

```bash
# Check container networks
docker network ls
docker inspect <network-name>

# Test connectivity between containers
docker exec -it <container-id> ping <other-container>

# Check port bindings
netstat -tlnp | grep 3000
```

### Proxy Debug (Traefik)

```bash
# Check Traefik dashboard (if enabled)
# Look for your service in the dashboard

# Check Traefik logs
docker logs traefik-container-name

# Verify routing rules
docker exec traefik-container cat /etc/traefik/dynamic.yml
```

## Recovery Strategies

### Quick Fixes to Try:

1. **Restart Deployment**:
   - Go to Coolify dashboard
   - Click "Redeploy" 
   - Monitor build and startup logs

2. **Clear and Rebuild**:
   - Force rebuild without cache
   - Check if build process changes

3. **Simplify Configuration**:
   - Remove unnecessary environment variables
   - Use minimal docker-compose setup
   - Verify domain configuration

### If All Else Fails:

1. **Test Locally First**:
   ```bash
   docker build -t test-app .
   docker run -p 3000:3000 test-app
   curl http://localhost:3000/api/health
   ```

2. **Deploy to Different Domain**:
   - Test if issue is domain-specific
   - Try with different subdomain

3. **Check Coolify Logs**:
   - Look for proxy errors
   - Check system-level issues
   - Review deployment history

## Prevention Tips

1. **Always Test Locally**:
   - Build and run container locally before deploying
   - Test all endpoints work correctly
   - Verify environment variables

2. **Use Debug Endpoint**:
   - Include debug endpoint in all deployments
   - Check it immediately after deployment
   - Monitor for configuration drift

3. **Monitor Health Checks**:
   - Set up proper health endpoints
   - Monitor health check status
   - Alert on failures

4. **Document Configuration**:
   - Keep deployment settings documented
   - Note working configurations
   - Version control all config files

## Success Checklist

Deployment is working correctly when:

- [ ] Application status is "Running" in Coolify
- [ ] Health checks consistently passing
- [ ] `curl https://your-domain.com/` returns 200
- [ ] `curl https://your-domain.com/api/health` returns healthy status
- [ ] Debug endpoint shows all diagnostics passing
- [ ] Application UI loads and functions correctly
- [ ] No errors in application logs
- [ ] Response times are reasonable (<3 seconds)

---

**Remember**: Most 404 errors in Coolify deployments are caused by application binding issues, proxy configuration problems, or domain setup issues. Work through this guide systematically to identify and resolve the root cause.