import { NextResponse } from "next/server";

/**
 * Simple health check endpoint for Docker and Coolify deployments
 * Returns basic application status
 */
export async function GET() {
  try {
    console.log(`[${new Date().toISOString()}] Health check requested`);

    const healthStatus = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: "1.0.0",
      env: {
        nodeEnv: process.env.NODE_ENV,
        port: process.env.PORT,
        hostname: process.env.HOSTNAME,
      },
      urls: {
        coolifyUrl: process.env.COOLIFY_URL,
        serviceFqdn: process.env.SERVICE_FQDN_APP,
      },
    };

    console.log(
      `[${new Date().toISOString()}] Health check response:`,
      JSON.stringify(healthStatus, null, 2),
    );

    return NextResponse.json(healthStatus, {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Health check failed:`, error);

    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Health check failed",
        timestamp: new Date().toISOString(),
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
