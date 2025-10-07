# Coolify Hello World

A simple Next.js application designed for testing Coolify deployments. This project demonstrates a basic system information dashboard with minimal configuration complexity.

## Features

- System information display (CPU, memory, network, container info)
- Terminal-style UI with Tailwind CSS
- Health check endpoints for Docker/Coolify
- Simplified Docker configuration
- TypeScript and React

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at http://localhost:3000

## Docker

Build and run with Docker:

```bash
# Build image
docker build -t coolify-hello-world .

# Run container
docker run -p 3000:3000 coolify-hello-world
```

Or use docker-compose:

```bash
docker-compose up --build
```

## Coolify Deployment

This application is optimized for Coolify deployment with:

- Simplified Dockerfile (single-stage build)
- Health check endpoint at `/api/health`
- Standard Next.js standalone output
- Minimal environment variables

### Deployment Steps:

1. **Create new application in Coolify**
2. **Connect your Git repository**
3. **Use these settings:**
   - Build Pack: Docker
   - Port: 3000
   - Health check URL: `/api/health`

### Environment Variables:

The app works with minimal configuration. Optional variables:

- `NODE_ENV=production` (automatically set)
- `PORT=3000` (default)

## API Endpoints

- `/` - Main dashboard
- `/api/health` - Simple health check (for Docker/Coolify)
- `/api/system` - Detailed system information

## Troubleshooting

### 404 Errors on Coolify

1. Ensure the build completes successfully
2. Check that port 3000 is exposed
3. Verify health check endpoint is accessible
4. Check Coolify logs for build/runtime errors

### Health Check Failures

The health endpoint `/api/health` should return:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45,
  "version": "1.0.0"
}
```

### Docker Issues

- Make sure you have Node.js 18+ 
- Check that all dependencies install correctly
- Verify the Next.js build completes without errors

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Query
- Docker

## License

MIT