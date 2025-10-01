/**
 * Utility functions for data formatting, calculations, and terminal display
 */

/**
 * Converts bytes to human-readable format with appropriate units
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Converts seconds to human-readable uptime format
 */
export const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const parts: string[] = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`);

  return parts.join(' ');
};

/**
 * Formats a number with appropriate decimal places and thousand separators
 */
export const formatNumber = (num: number, decimals: number = 0): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Formats CPU frequency from MHz to GHz
 */
export const formatCpuSpeed = (mhz: number): string => {
  const ghz = mhz / 1000;
  return `${ghz.toFixed(2)} GHz`;
};

/**
 * Formats load average values for display
 */
export const formatLoadAverage = (loadAvg: number[]): string => {
  return loadAvg.map(load => load.toFixed(2)).join(', ');
};

/**
 * Creates a progress bar string for terminal display
 */
export const createProgressBar = (
  percentage: number,
  width: number = 20,
  filled: string = '█',
  empty: string = '░'
): string => {
  const filledWidth = Math.round((percentage / 100) * width);
  const emptyWidth = width - filledWidth;

  return filled.repeat(filledWidth) + empty.repeat(emptyWidth);
};

/**
 * Pads a string to specified length with spaces or specified character
 */
export const padString = (
  str: string,
  length: number,
  padChar: string = ' ',
  padStart: boolean = false
): string => {
  const padLength = Math.max(0, length - str.length);
  const padding = padChar.repeat(padLength);

  return padStart ? padding + str : str + padding;
};

/**
 * Truncates a string to specified length with ellipsis
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
};

/**
 * Formats a timestamp to terminal-friendly format
 */
export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

/**
 * Converts milliseconds to human-readable duration
 */
export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Generates a random terminal-style ID
 */
export const generateTerminalId = (): string => {
  const chars = 'ABCDEF0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Validates if a string is a valid hostname
 */
export const isValidHostname = (hostname: string): boolean => {
  const hostnameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/;
  return hostnameRegex.test(hostname) && hostname.length <= 253;
};

/**
 * Formats network address with port if applicable
 */
export const formatNetworkAddress = (address: string, port?: number): string => {
  if (!port) return address;

  // IPv6 addresses need brackets
  if (address.includes(':') && !address.startsWith('[')) {
    return `[${address}]:${port}`;
  }

  return `${address}:${port}`;
};

/**
 * Creates ASCII-style box border for terminal display
 */
export const createAsciiBox = (
  content: string,
  width: number,
  title?: string
): string => {
  const lines = content.split('\n');
  const contentWidth = width - 4; // Account for borders

  let result = '';

  // Top border
  if (title) {
    const titlePadding = Math.max(0, contentWidth - title.length - 2);
    const leftPad = Math.floor(titlePadding / 2);
    const rightPad = titlePadding - leftPad;
    result += `┌${'─'.repeat(leftPad)}[ ${title} ]${'─'.repeat(rightPad)}┐\n`;
  } else {
    result += `┌${'─'.repeat(contentWidth + 2)}┐\n`;
  }

  // Content lines
  lines.forEach(line => {
    const paddedLine = padString(line, contentWidth);
    result += `│ ${paddedLine} │\n`;
  });

  // Bottom border
  result += `└${'─'.repeat(contentWidth + 2)}┘`;

  return result;
};

/**
 * Calculates memory usage percentage
 */
export const calculateMemoryUsage = (used: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((used / total) * 100);
};

/**
 * Determines the color class based on usage percentage
 */
export const getUsageColorClass = (percentage: number): string => {
  if (percentage >= 90) return 'text-terminal-red';
  if (percentage >= 70) return 'text-terminal-amber';
  if (percentage >= 50) return 'text-terminal-cyan';
  return 'text-terminal-green';
};

/**
 * Formats JSON data for terminal display with proper indentation
 */
export const formatJsonForTerminal = (data: object): string => {
  return JSON.stringify(data, null, 2)
    .split('\n')
    .map(line => `  ${line}`)
    .join('\n');
};

/**
 * Debounces a function call
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Clamps a number between min and max values
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};
