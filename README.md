# 🚀 Coolify Hello World - System Info Terminal

A beautiful terminal-style system information display built with Next.js, TypeScript, and React. Perfect for testing Coolify deployments and monitoring your homelab infrastructure.

![Terminal Demo](https://img.shields.io/badge/Demo-Terminal%20UI-00ff00?style=for-the-badge&logo=gnometerminal)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)
![Coolify](https://img.shields.io/badge/Coolify-Compatible-FF6B6B?style=for-the-badge)

## ✨ Features

- 🖥️ **Real-time System Monitoring** - Live system stats with auto-refresh
- 🎨 **Terminal Aesthetics** - Beautiful ASCII art and retro terminal styling
- 🐳 **Container Detection** - Automatic Docker/Kubernetes environment detection
- 📊 **Resource Visualization** - Memory usage bars and CPU load indicators
- 🌐 **Network Information** - Display all network interfaces and addresses
- ⚡ **Performance Optimized** - Built with Next.js 14 and TypeScript
- 🔒 **Security Focused** - Non-root container execution and minimal permissions
- 📱 **Responsive Design** - Works great on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom terminal theme
- **Data Fetching**: TanStack React Query
- **API**: Next.js API Routes
- **Containerization**: Docker with Alpine Linux
- **Deployment**: Docker Compose, Coolify compatible

## 📋 Prerequisites

- Node.js 18+ (for local development)
- Docker and Docker Compose
- Coolify instance (for production deployment)

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd coolify-hello-world
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   ```
   http://localhost:3000
   ```

3. **View logs**
   ```bash
   docker-compose logs -f
   ```

## 🏠 Coolify Deployment

### Method 1: Docker Compose (Recommended)

1. **Create a new project in Coolify**
   - Go to your Coolify dashboard
   - Click "Create New Project"
   - Choose "Docker Compose" as the deployment method

2. **Upload the docker-compose.yml file**
   ```yaml
   # Use the provided docker-compose.yml from this repository
   ```

3. **Configure environment variables**
   - Copy values from `.env.example`
   - Adjust `APP_URL` to match your domain
   - Set `TZ` to your timezone

4. **Deploy**
   - Click "Deploy"
   - Coolify will build and start the container

### Method 2: Git Repository

1. **Connect your Git repository**
   - Add this repository to Coolify
   - Select the main branch

2. **Configure build settings**
   - Build Pack: `nixpacks` or `dockerfile`
   - Root Directory: `/`
   - Port: `3000`

3. **Set environment variables**
   ```env
   NODE_ENV=production
   PORT=3000
   HOSTNAME=0.0.0.0
   ```

4. **Deploy**
   - Coolify will automatically build and deploy

### Domain Configuration

1. **Add your domain in Coolify**
   - Go to your application settings
   - Add your custom domain
   - Enable SSL/TLS certificates

2. **Update environment variables**
   ```env
   APP_URL=https://your-domain.com
   ```

## 📡 API Documentation

### GET /api/system

Returns comprehensive system information in JSON format.

**Response Schema:**
```typescript
{
  success: boolean;
  data: {
    system: {
      hostname: string;
      platform: string;
      architecture: string;
      nodeVersion: string;
      uptime: number;
      timestamp: string;
    };
    memory: {
      totalMemory: number;
      freeMemory: number;
      usedMemory: number;
      usagePercentage: number;
    };
    cpu: {
      model: string;
      cores: number;
      speed: number;
      loadAverage: number[];
    };
    network: Array<{
      name: string;
      address: string;
      family: string;
      internal: boolean;
      mac: string;
    }>;
    environment: {
      nodeEnv: string;
      port: string;
      timezone: string;
      locale: string;
    };
    container: {
      isContainer: boolean;
      containerRuntime?: string;
      imageName?: string;
      containerId?: string;
    };
  };
  timestamp: string;
  version: string;
}
```

**Example Request:**
```bash
curl -X GET http://localhost:3000/api/system
```

## ⚙️ Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Application environment |
| `PORT` | `3000` | Server port |
| `HOSTNAME` | `0.0.0.0` | Server hostname |
| `TZ` | `UTC` | Timezone |
| `REFRESH_INTERVAL` | `5000` | Auto-refresh interval (ms) |
| `SHOW_ASCII_ART` | `true` | Show ASCII art header |

### Terminal Customization

The terminal UI can be customized through CSS variables in `globals.css`:

```css
:root {
  --terminal-bg: #0a0a0a;
  --terminal-green: #00ff00;
  --terminal-amber: #ffb000;
  --terminal-blue: #0088ff;
  --terminal-red: #ff4444;
  --terminal-cyan: #00ffff;
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   ```bash
   # Change the port in docker-compose.yml
   ports:
     - "3001:3000"
   ```

2. **Permission denied errors**
   ```bash
   # Ensure Docker has proper permissions
   sudo chown -R $USER:$USER .
   ```

3. **Container won't start**
   ```bash
   # Check logs
   docker-compose logs coolify-hello-world
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

4. **System info not loading**
   - Check if the API endpoint is accessible: `/api/system`
   - Verify network connectivity
   - Check browser console for errors

### Health Checks

The application includes built-in health checks:

- **HTTP Health Check**: `GET /api/system`
- **Docker Health Check**: Automatically configured
- **Response Time**: Should be < 3 seconds

### Performance Optimization

1. **Memory Usage**
   - Monitor with: `docker stats coolify-hello-world-app`
   - Typical usage: ~50-100MB

2. **CPU Usage**
   - Should remain low during normal operation
   - Spikes during system info collection are normal

## 📊 Monitoring

### Logs

```bash
# Docker Compose logs
docker-compose logs -f

# Container logs
docker logs coolify-hello-world-app -f

# Coolify logs
# Available in the Coolify dashboard
```

### Metrics

The application exposes system metrics through the `/api/system` endpoint for monitoring tools:

- Memory usage and trends
- CPU load averages
- Network interface status
- Container runtime information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Use TypeScript strict mode
- Follow the existing code style
- Add JSDoc comments for functions
- Test your changes locally and with Docker
- Update documentation as needed

## 🔧 Development Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Type checking
npx tsc --noEmit
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- Built for the amazing [Coolify](https://coolify.io/) project
- Inspired by classic terminal interfaces
- Terminal styling influenced by retro computing aesthetics

## 📞 Support

If you encounter any issues or have questions:

1. Check the [troubleshooting section](#-troubleshooting)
2. Search existing [GitHub issues](../../issues)
3. Create a new issue with detailed information
4. Join the Coolify community for deployment help

---

**Made with ❤️ for the homelab community**

Deploy with confidence using Coolify! 🚀