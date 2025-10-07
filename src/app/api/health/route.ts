import { NextResponse } from "next/server";

/**
 * Simple health check endpoint for Docker and Coolify deployments
 * Returns basic application status
 */
export async function GET() {
  try {
    const healthStatus = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: "1.0.0"
    };

    return NextResponse.json(healthStatus, {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache"
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Health check failed",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
