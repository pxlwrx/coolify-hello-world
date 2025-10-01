import { NextRequest, NextResponse } from "next/server";
import {
  networkInterfaces,
  hostname,
  platform,
  arch,
  cpus,
  freemem,
  totalmem,
  uptime,
  loadavg,
} from "os";
import { readFileSync, existsSync } from "fs";
import type {
  SystemInfoApiResponse,
  SystemInfoResponse,
  ContainerInfo,
  NetworkInterface,
  MemoryInfo,
  CpuInfo,
  EnvironmentInfo,
  SystemInfo,
  ApiErrorResponse,
} from "@/types/system";

/**
 * Detects if the application is running inside a container
 * Checks for common container indicators
 */
const detectContainerEnvironment = (): ContainerInfo => {
  let isContainer = false;
  let containerRuntime: string | undefined;
  let containerId: string | undefined;

  try {
    if (existsSync("/.dockerenv")) {
      isContainer = true;
      containerRuntime = "docker";
    }

    if (existsSync("/proc/1/cgroup")) {
      const cgroup = readFileSync("/proc/1/cgroup", "utf8");
      if (cgroup.includes("docker")) {
        isContainer = true;
        containerRuntime = "docker";
        const dockerMatch = cgroup.match(/docker\/([a-f0-9]{64})/);
        if (dockerMatch) {
          containerId = dockerMatch[1].substring(0, 12);
        }
      } else if (cgroup.includes("containerd")) {
        isContainer = true;
        containerRuntime = "containerd";
      }
    }

    if (process.env.KUBERNETES_SERVICE_HOST) {
      isContainer = true;
      containerRuntime = containerRuntime || "kubernetes";
    }
  } catch (error) {
    // Silently fail container detection
  }

  return {
    isContainer,
    containerRuntime,
    containerId,
    imageName: process.env.IMAGE_NAME,
  };
};

/**
 * Formats memory values from bytes to human readable format
 */
const formatMemoryInfo = (): MemoryInfo => {
  const total = totalmem();
  const free = freemem();
  const used = total - free;
  const usagePercentage = Math.round((used / total) * 100);

  return {
    totalMemory: total,
    freeMemory: free,
    usedMemory: used,
    usagePercentage,
  };
};

/**
 * Gathers CPU information including model, cores, and load average
 */
const getCpuInfo = (): CpuInfo => {
  const cpuData = cpus();
  const firstCpu = cpuData[0];
  const loadAverages = loadavg();

  return {
    model: firstCpu.model,
    cores: cpuData.length,
    speed: firstCpu.speed,
    loadAverage: loadAverages,
  };
};

/**
 * Extracts network interface information excluding internal/loopback interfaces
 */
const getNetworkInfo = (): NetworkInterface[] => {
  const interfaces = networkInterfaces();
  const networkList: NetworkInterface[] = [];

  Object.entries(interfaces).forEach(([name, addresses]) => {
    if (addresses) {
      addresses.forEach((addr) => {
        networkList.push({
          name,
          address: addr.address,
          family: addr.family,
          internal: addr.internal,
          mac: addr.mac,
        });
      });
    }
  });

  return networkList.filter((iface) => !iface.internal);
};

/**
 * Gathers basic system information
 */
const getSystemInfo = (): SystemInfo => {
  return {
    hostname: hostname(),
    platform: platform(),
    architecture: arch(),
    nodeVersion: process.version,
    uptime: Math.floor(uptime()),
    timestamp: new Date().toISOString(),
  };
};

/**
 * Extracts safe environment variables for display
 */
const getEnvironmentInfo = (): EnvironmentInfo => {
  return {
    nodeEnv: process.env.NODE_ENV || "development",
    port: process.env.PORT || "3000",
    timezone:
      process.env.TZ || Intl.DateTimeFormat().resolvedOptions().timeZone,
    locale: process.env.LANG || "en_US.UTF-8",
  };
};

/**
 * GET handler for system information endpoint
 * Returns comprehensive system information including hardware, network, and runtime details
 */
export async function GET(
  request: NextRequest,
): Promise<NextResponse<SystemInfoApiResponse | ApiErrorResponse>> {
  try {
    const systemData: SystemInfoResponse = {
      system: getSystemInfo(),
      memory: formatMemoryInfo(),
      cpu: getCpuInfo(),
      network: getNetworkInfo(),
      environment: getEnvironmentInfo(),
      container: detectContainerEnvironment(),
    };

    const response: SystemInfoApiResponse = {
      success: true,
      data: systemData,
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: {
        message: "Failed to retrieve system information",
        code: "SYSTEM_INFO_ERROR",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
