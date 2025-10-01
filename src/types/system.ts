/**
 * System information interfaces for the terminal-style system info display
 */

/**
 * Basic system information structure
 */
export interface SystemInfo {
  hostname: string;
  platform: string;
  architecture: string;
  nodeVersion: string;
  uptime: number;
  timestamp: string;
}

/**
 * Memory usage information
 */
export interface MemoryInfo {
  totalMemory: number;
  freeMemory: number;
  usedMemory: number;
  usagePercentage: number;
}

/**
 * CPU information
 */
export interface CpuInfo {
  model: string;
  cores: number;
  speed: number;
  loadAverage: number[];
}

/**
 * Network interface information
 */
export interface NetworkInterface {
  name: string;
  address: string;
  family: string;
  internal: boolean;
  mac: string;
}

/**
 * Environment variables (filtered for security)
 */
export interface EnvironmentInfo {
  nodeEnv: string;
  port: string;
  timezone: string;
  locale: string;
}

/**
 * Container information (if running in container)
 */
export interface ContainerInfo {
  isContainer: boolean;
  containerRuntime?: string;
  imageName?: string;
  containerId?: string;
}

/**
 * Complete system information response
 */
export interface SystemInfoResponse {
  system: SystemInfo;
  memory: MemoryInfo;
  cpu: CpuInfo;
  network: NetworkInterface[];
  environment: EnvironmentInfo;
  container: ContainerInfo;
}

/**
 * API response wrapper for system info endpoint
 */
export interface SystemInfoApiResponse {
  success: boolean;
  data: SystemInfoResponse;
  timestamp: string;
  version: string;
}

/**
 * Error response structure
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: string;
  };
  timestamp: string;
}

/**
 * Terminal display configuration
 */
export interface TerminalConfig {
  showAsciiArt: boolean;
  animateText: boolean;
  refreshInterval: number;
  theme: 'green' | 'amber' | 'blue' | 'cyan';
}

/**
 * Terminal command structure for display
 */
export interface TerminalCommand {
  prompt: string;
  command: string;
  output: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
}
