import { NextRequest, NextResponse } from "next/server";
import { hostname, networkInterfaces } from "os";

// Force this endpoint to be dynamic
export const dynamic = "force-dynamic";

/**
 * Debug endpoint to help troubleshoot Coolify deployment issues
 * This endpoint provides comprehensive information about the running environment
 */
export async function GET(request: NextRequest) {
  try {
    const now = new Date().toISOString();

    // Get request information (avoiding request.url for static generation)
    const requestInfo = {
      method: request.method,
      userAgent: request.headers.get("user-agent") || "unknown",
      forwardedFor: request.headers.get("x-forwarded-for") || null,
      realIp: request.headers.get("x-real-ip") || null,
      host: request.headers.get("host") || "unknown",
      origin: request.headers.get("origin") || null,
      referer: request.headers.get("referer") || null,
    };

    // Get environment information
    const envInfo = {
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT,
      hostname: process.env.HOSTNAME,
      // Coolify specific variables
      coolifyBranch: process.env.COOLIFY_BRANCH,
      coolifyResourceUuid: process.env.COOLIFY_RESOURCE_UUID,
      coolifyContainerName: process.env.COOLIFY_CONTAINER_NAME,
      serviceUrlApp: process.env.SERVICE_URL_APP,
      serviceFqdnApp: process.env.SERVICE_FQDN_APP,
      coolifyUrl: process.env.COOLIFY_URL,
      coolifyFqdn: process.env.COOLIFY_FQDN,
      serviceNameApp: process.env.SERVICE_NAME_APP,
    };

    // Get system information
    const systemInfo = {
      hostname: hostname(),
      uptime: process.uptime(),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
      cwd: process.cwd(),
    };

    // Get network interfaces (filtered for security)
    const interfaces = networkInterfaces();
    const networkInfo = Object.entries(interfaces).reduce(
      (acc, [name, addresses]) => {
        if (addresses) {
          acc[name] = addresses.map((addr) => ({
            address: addr.address,
            family: addr.family,
            internal: addr.internal,
          }));
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    // Check if we're in a container
    const containerInfo = {
      isContainer: process.env.COOLIFY_CONTAINER_NAME ? true : false,
      containerName: process.env.COOLIFY_CONTAINER_NAME,
      resourceUuid: process.env.COOLIFY_RESOURCE_UUID,
    };

    // Get some basic app health
    const appHealth = {
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      timestamp: now,
    };

    // Try to detect common issues
    const diagnostics = {
      hasCorrectPort: process.env.PORT === "3000",
      hasHostname: !!process.env.HOSTNAME,
      hasCoolifyVars: !!process.env.COOLIFY_CONTAINER_NAME,
      hasServiceFqdn: !!process.env.SERVICE_FQDN_APP,
      requestHost: request.headers.get("host"),
      expectedHost: process.env.SERVICE_FQDN_APP,
      hostMatches: request.headers.get("host") === process.env.SERVICE_FQDN_APP,
    };

    const debugData = {
      timestamp: now,
      message: "Debug information for Coolify deployment troubleshooting",
      request: requestInfo,
      environment: envInfo,
      system: systemInfo,
      network: networkInfo,
      container: containerInfo,
      health: appHealth,
      diagnostics,
      suggestions: [
        diagnostics.hasCorrectPort
          ? "✅ Port is correctly set to 3000"
          : "❌ Port issue detected",
        diagnostics.hasHostname ? "✅ Hostname is set" : "❌ Hostname not set",
        diagnostics.hasCoolifyVars
          ? "✅ Running in Coolify environment"
          : "❌ Not running in Coolify",
        diagnostics.hostMatches
          ? "✅ Request host matches service FQDN"
          : "❌ Host mismatch - potential proxy issue",
      ],
    };

    // Log this debug request
    console.log(
      `[${now}] Debug endpoint accessed from ${requestInfo.forwardedFor || requestInfo.realIp || "unknown"}`,
    );
    console.log(
      `[${now}] Request host: ${requestInfo.host}, Expected: ${process.env.SERVICE_FQDN_APP}`,
    );

    return NextResponse.json(debugData, {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Debug endpoint error:`, error);

    return NextResponse.json(
      {
        error: "Debug endpoint failed",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
