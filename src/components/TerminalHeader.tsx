"use client";

import React from "react";

interface TerminalHeaderProps {
  title?: string;
  showControls?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  title = "system-info@coolify:~",
  showControls = true,
  onClose,
  onMinimize,
  onMaximize,
}) => {
  return (
    <header className="terminal-header">
      {showControls && (
        <div className="flex items-center gap-2 mr-4">
          <button
            className="terminal-button red hover:brightness-110 transition-all duration-200 rounded-full"
            onClick={onClose}
            aria-label="Close terminal window"
            type="button"
          />
          <button
            className="terminal-button amber hover:brightness-110 transition-all duration-200 rounded-full"
            onClick={onMinimize}
            aria-label="Minimize terminal window"
            type="button"
          />
          <button
            className="terminal-button green hover:brightness-110 transition-all duration-200 rounded-full"
            onClick={onMaximize}
            aria-label="Maximize terminal window"
            type="button"
          />
        </div>
      )}

      <div className="flex items-center gap-2 flex-1">
        <span className="text-terminal-green/70 text-xs">●</span>
        <h1 className="text-terminal-green text-sm font-mono font-medium glow-text">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 text-xs text-terminal-green/50">
        <span>SSH</span>
        <span className="animate-pulse">●</span>
      </div>
    </header>
  );
};
