"use client";

import React, { useState } from "react";
import { TerminalHeader } from "@/components/TerminalHeader";
import { SystemInfoDisplay } from "@/components/SystemInfoDisplay";

interface HomePageState {
  isMaximized: boolean;
  refreshInterval: number;
  showAsciiArt: boolean;
}

const HomePage: React.FC = () => {
  const [state, setState] = useState<HomePageState>({
    isMaximized: true,
    refreshInterval: 5000,
    showAsciiArt: false,
  });

  const handleMaximize = (): void => {
    setState((prev) => ({
      ...prev,
      isMaximized: !prev.isMaximized,
    }));
  };

  const handleMinimize = (): void => {
    // In a real terminal, this might minimize the window
    console.log("Terminal minimize requested");
  };

  const handleClose = (): void => {
    // In a real terminal, this might close the window
    console.log("Terminal close requested");
  };

  const toggleAsciiArt = (): void => {
    setState((prev) => ({
      ...prev,
      showAsciiArt: !prev.showAsciiArt,
    }));
  };

  const updateRefreshInterval = (interval: number): void => {
    setState((prev) => ({
      ...prev,
      refreshInterval: interval,
    }));
  };

  return (
    <div className="min-h-screen flex items-start justify-center p-4">
      <div
        className={`terminal-window transition-all duration-300 ${
          state.isMaximized
            ? "w-full h-full max-w-none max-h-none"
            : "w-full max-w-6xl min-h-[85vh]"
        }`}
      >
        <TerminalHeader
          title="coolify-system-info@homelab:~"
          onClose={handleClose}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
        />

        <div className="flex-1 overflow-y-auto">
          <SystemInfoDisplay
            refreshInterval={state.refreshInterval}
            showAsciiArt={state.showAsciiArt}
            animated={true}
          />

          <div className="border-t border-terminal-green/20 p-4">
            <div className="flex flex-wrap items-center gap-4 text-xs text-terminal-green/70">
              <button
                onClick={toggleAsciiArt}
                className="hover:text-terminal-green transition-colors duration-200 border border-terminal-green/20 px-2 py-1 rounded"
                type="button"
              >
                {state.showAsciiArt ? "Hide" : "Show"} ASCII Art
              </button>

              <div className="flex items-center gap-2">
                <span>Refresh:</span>
                <select
                  value={state.refreshInterval}
                  onChange={(e) =>
                    updateRefreshInterval(Number(e.target.value))
                  }
                  className="bg-terminal-bg border border-terminal-green/20 text-terminal-green text-xs px-2 py-1 rounded focus:outline-none focus:border-terminal-green"
                >
                  <option value={1000}>1s</option>
                  <option value={5000}>5s</option>
                  <option value={10000}>10s</option>
                  <option value={30000}>30s</option>
                  <option value={60000}>1m</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 text-xs text-terminal-green/30 font-mono">
        <div>Coolify Deployment Test</div>
      </div>
    </div>
  );
};

export default HomePage;
