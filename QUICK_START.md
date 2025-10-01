# 🚀 Quick Start Guide

**Coolify Hello World - System Info Terminal**

A beautiful terminal-style system information display built with Next.js, TypeScript, and React Query, ready for Coolify deployment.

![Terminal Style](https://img.shields.io/badge/Style-Terminal-00ff00?style=flat-square) ![Docker Ready](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square) ![Coolify Compatible](https://img.shields.io/badge/Coolify-Compatible-FF6B6B?style=flat-square)

## ✨ What You Get

- 🖥️ **Real-time System Monitoring** with auto-refresh
- 🎨 **Retro Terminal UI** with ASCII art and green glow effects
- 🐳 **Container Detection** (Docker/Kubernetes awareness)
- 📊 **System Metrics** (CPU, Memory, Network, Uptime)
- 🔄 **Live Updates** every 5 seconds (configurable)
- 🌐 **REST API** endpoint for system information
- 📱 **Responsive Design** works on all devices

## 🏃‍♂️ 30-Second Local Test

```bash
# Clone and test locally
git clone <your-repo-url>
cd coolify-hello-world
docker-compose -f docker-compose.local.yml up -d

# Visit http://localhost:3000
# API: http://localhost:3000/api/system

# Clean up
docker-compose -f docker-compose.local.yml down
```

## 🚀 Deploy to Coolify (3 Steps)

### Step 1: Create Project
- Open your Coolify dashboard
- Click **"Create New Project"**
- Choose **"Docker Compose"**

### Step 2: Configure
- **Name**: `coolify-hello-world`
- **Upload**: Use the `docker-compose.yml` file
- **Domain**: `hello-world.yourdomain.com`
- **Environment Variables**:
  ```env
  NODE_ENV=production
  TZ=America/New_York  # Your timezone
  ```

### Step 3: Deploy
- Click **"Deploy"**
- Wait for build completion (~2-3 minutes)
- Visit your domain to see the terminal interface

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Application environment |
| `PORT` | `3000` | Server port |
| `TZ` | `UTC` | Timezone for system info |
| `REFRESH_INTERVAL` | `5000` | Auto-refresh interval (ms) |

## 📊 What You'll See

```
╔═══════════════════════════════════════════════════════════════╗
║   ____            _ _  __         _   _      _ _               ║
║  / ___|___   ___ | (_)/ _|_   _  | | | | ___| | | ___          ║
║ | |   / _ \ / _ \| | | |_| | | | | |_| |/ _ \ | |/ _ \         ║
║ | |__| (_) | (_) | | |  _| |_| | |  _  |  __/ | | (_) |        ║
║  \____\___/ \___/|_|_|_|  \__, | |_| |_|\___|_|_|\___/         ║
║                           |___/                               ║
║                    System Information Terminal                ║
╚═══════════════════════════════════════════════════════════════╝

root@your-hostname:~$ systeminfo --detailed
═══════════════════════════════════════════════════════════
SYSTEM INFORMATION REPORT - 2024-01-01 12:00:00
═══════════════════════════════════════════════════════════

📡 SYSTEM OVERVIEW          🧠 MEMORY STATUS
Hostname: your-server       Total: 8.0 GB
Platform: linux (x64)       Used: 2.1 GB (26%)
Node.js: v18.20.8           Free: 5.9 GB
Uptime: 2d 4h 15m           Usage: ████████░░░░░░░░░░ 26%

⚡ PROCESSOR INFO            🌐 NETWORK INTERFACES
Model: Intel Core i7        eth0: 192.168.1.100 (IPv4)
Cores: 8                    wlan0: 10.0.0.50 (IPv4)
Speed: 3.2 GHz             
Load Avg: 0.15, 0.10, 0.05  

✓ System scan completed successfully | Auto-refresh: 5s _
```

## 🔍 Verification

After deployment, test these endpoints:

```bash
# Health check
curl https://your-domain.com/api/system

# Expected response
{
  "success": true,
  "data": {
    "system": { "hostname": "...", ... },
    "memory": { "totalMemory": ..., ... },
    ...
  }
}
```

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Build fails | Check logs for missing dependencies |
| Port conflicts | Change port in `docker-compose.yml` |
| Health check fails | Verify `/api/system` endpoint is accessible |
| No system data | Check container permissions |

## 📚 Documentation

- **[README.md](README.md)** - Detailed project information
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Code organization

## 🎯 Next Steps

After successful deployment:

1. **Custom Domain**: Set up your own domain and SSL
2. **Monitoring**: Use the API endpoint for external monitoring
3. **Customize**: Modify the terminal theme and refresh intervals
4. **Scale**: Add more system metrics or monitoring features

## 💡 Pro Tips

- **Performance**: Typical memory usage is 50-100MB
- **Security**: Runs as non-root user with minimal privileges
- **Monitoring**: Perfect for homelab dashboard integration
- **API**: Use `/api/system` for your monitoring tools

## 🤝 Support

- **Issues**: Check deployment logs first
- **Local Testing**: Always test with Docker Compose locally
- **Coolify Help**: Join the Coolify community Discord

---

**🎉 That's it!** You now have a beautiful terminal-style system monitor running on Coolify!

**Quick Links:**
- 🌐 Web Interface: `https://your-domain.com`
- 🔗 API Endpoint: `https://your-domain.com/api/system`
- 📊 Real-time monitoring with retro terminal aesthetics
- 🐳 Fully containerized and production-ready

Happy monitoring! 🖥️✨