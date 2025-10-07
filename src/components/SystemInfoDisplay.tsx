"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import type { SystemInfoApiResponse, NetworkInterface } from "@/types/system";
import {
  formatBytes,
  formatUptime,
  formatCpuSpeed,
  formatLoadAverage,
  createProgressBar,
  getUsageColorClass,
  formatTimestamp,
} from "@/lib/utils";

interface SystemInfoDisplayProps {
  refreshInterval?: number;
  showAsciiArt?: boolean;
  animated?: boolean;
}

const fetchSystemInfo = async (): Promise<SystemInfoApiResponse> => {
  const response = await fetch("/api/system", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const ASCII_ART = `
╔═══════════════════════════════════════════════════════════════╗
║   ____            _ _  __         _   _      _ _               ║
║  / ___|___   ___ | (_)/ _|_   _  | | | | ___| | | ___          ║
║ | |   / _ \\ / _ \\| | | |_| | | | | |_| |/ _ \\ | |/ _ \\         ║
║ | |__| (_) | (_) | | |  _| |_| | |  _  |  __/ | | (_) |        ║
║  \\____\\___/ \\___/|_|_|_|  \\__, | |_| |_|\\___|_|_|\\___/         ║
║                           |___/                               ║
║                    System Information Terminal                ║
╚═══════════════════════════════════════════════════════════════╝
`;

export const SystemInfoDisplay: React.FC<SystemInfoDisplayProps> = ({
  refreshInterval = 5000,
  showAsciiArt = true,
  animated = true,
}) => {
  const {
    data: systemInfo,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["systemInfo"],
    queryFn: fetchSystemInfo,
    refetchInterval: refreshInterval,
    refetchIntervalInBackground: true,
    staleTime: 1000,
    gcTime: 5000,
  });

  if (isLoading) {
    return (
      <div className="terminal-content">
        <div className="flex items-center gap-2 text-terminal-green">
          <span className="animate-spin">⟳</span>
          <span>system scan</span>
          <span className="loading-dots"></span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="terminal-content">
        <div className="text-terminal-red">
          <div className="mb-2">✗ System scan failed</div>
          <div className="text-terminal-red/70 text-sm">
            Error: {error instanceof Error ? error.message : "Unknown error"}
          </div>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 border border-terminal-red text-terminal-red hover:bg-terminal-red/10 transition-colors duration-200"
            type="button"
          >
            Retry Scan
          </button>
        </div>
      </div>
    );
  }

  if (!systemInfo?.success || !systemInfo.data) {
    return (
      <div className="terminal-content">
        <div className="text-terminal-amber">⚠ No system data available</div>
      </div>
    );
  }

  const { system, memory, cpu, network, environment, container } =
    systemInfo.data;
  const memoryUsageClass = getUsageColorClass(memory.usagePercentage);
  const memoryBar = createProgressBar(memory.usagePercentage, 30);

  return (
    <div className="terminal-content space-y-6 flex flex-col h-full">
      {showAsciiArt && (
        <div className="ascii-art text-center text-terminal-green/60">
          {ASCII_ART}
        </div>
      )}

      <div className="system-info-grid flex-1 pb-4">
        <section className="info-card">
          <h3 className="info-label text-lg mb-4 border-b border-terminal-cyan/30 pb-2">
            📡 SYSTEM OVERVIEW
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-terminal-cyan">Hostname:</span>
              <span className="info-value font-bold">{system.hostname}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-terminal-cyan">Platform:</span>
              <span className="info-value">
                {system.platform} ({system.architecture})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-terminal-cyan">Node.js:</span>
              <span className="info-value">{system.nodeVersion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-terminal-cyan">Uptime:</span>
              <span className="info-value">{formatUptime(system.uptime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-terminal-cyan">Environment:</span>
              <span className="info-value uppercase">
                {environment.nodeEnv}
              </span>
            </div>
          </div>
        </section>

        <section className="info-card">
          <h3 className="info-label text-lg mb-4 border-b border-terminal-cyan/30 pb-2">
            🧠 MEMORY STATUS
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-terminal-cyan">Total:</span>
              <span className="info-value">
                {formatBytes(memory.totalMemory)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-terminal-cyan">Used:</span>
              <span className={memoryUsageClass}>
                {formatBytes(memory.usedMemory)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-terminal-cyan">Free:</span>
              <span className="info-value">
                {formatBytes(memory.freeMemory)}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between mb-1">
                <span className="text-terminal-cyan">Usage:</span>
                <span className={memoryUsageClass}>
                  {memory.usagePercentage}%
                </span>
              </div>
              <div className="font-mono text-xs">
                <span className={memoryUsageClass}>{memoryBar}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="info-card">
          <h3 className="info-label text-lg mb-4 border-b border-terminal-cyan/30 pb-2">
            ⚡ PROCESSOR INFO
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-terminal-cyan">Model:</span>
              <span className="info-value text-xs">{cpu.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-terminal-cyan">Cores:</span>
              <span className="info-value">{cpu.cores}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-terminal-cyan">Speed:</span>
              <span className="info-value">{formatCpuSpeed(cpu.speed)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-terminal-cyan">Load Avg:</span>
              <span className="info-value text-xs">
                {formatLoadAverage(cpu.loadAverage)}
              </span>
            </div>
          </div>
        </section>

        <section className="info-card">
          <h3 className="info-label text-lg mb-4 border-b border-terminal-cyan/30 pb-2">
            🌐 NETWORK INTERFACES
          </h3>
          <div className="space-y-3 text-sm max-h-28 overflow-y-auto">
            {network.length > 0 ? (
              network.map((iface: NetworkInterface, index: number) => (
                <div
                  key={`${iface.name}-${index}`}
                  className="border-l-2 border-terminal-green/30 pl-3"
                >
                  <div className="flex justify-between">
                    <span className="text-terminal-cyan font-semibold">
                      {iface.name}:
                    </span>
                    <span className="info-value text-xs">{iface.family}</span>
                  </div>
                  <div className="info-value text-xs mt-1">{iface.address}</div>
                  <div className="text-terminal-green/50 text-xs">
                    {iface.mac}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-terminal-amber text-xs">
                No external interfaces found
              </div>
            )}
          </div>
        </section>

        {container.isContainer && (
          <section className="info-card">
            <h3 className="info-label text-lg mb-4 border-b border-terminal-cyan/30 pb-2">
              🐳 CONTAINER INFO
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-terminal-cyan">Runtime:</span>
                <span className="info-value uppercase">
                  {container.containerRuntime}
                </span>
              </div>
              {container.containerId && (
                <div className="flex justify-between">
                  <span className="text-terminal-cyan">ID:</span>
                  <span className="info-value font-mono text-xs">
                    {container.containerId}
                  </span>
                </div>
              )}
              {container.imageName && (
                <div className="flex justify-between">
                  <span className="text-terminal-cyan">Image:</span>
                  <span className="info-value text-xs">
                    {container.imageName}
                  </span>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="info-card">
          <h3 className="info-label text-lg mb-4 border-b border-terminal-cyan/30 pb-2">
            🌍 ENVIRONMENT
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-terminal-cyan">Port:</span>
              <span className="info-value">{environment.port}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-terminal-cyan">Timezone:</span>
              <span className="info-value text-xs">{environment.timezone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-terminal-cyan">Locale:</span>
              <span className="info-value text-xs">{environment.locale}</span>
            </div>
          </div>
        </section>
      </div>

      <div className="border-t border-terminal-green/20 pt-4 mt-auto">
        <div className="terminal-output">
          <div className="flex items-center gap-2">
            <span className="text-terminal-green">✓</span>
            <span className="text-terminal-green">
              System scan completed successfully
            </span>
            <span className="text-terminal-green/50">
              | Auto-refresh: {refreshInterval / 1000}s
            </span>
            <span className="animate-pulse text-terminal-green">_</span>
          </div>
        </div>
      </div>
    </div>
  );
};
