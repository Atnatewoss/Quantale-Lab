'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TerminalLine {
  id: string;
  content: string;
  type: 'system' | 'accent' | 'warn' | 'error' | 'result' | 'normal';
  timestamp: string;
  prompt?: string;
}

interface TerminalPanelProps {
  lines: TerminalLine[];
  isProcessing: boolean;
  onExecuteCommand?: (command: string) => void;
}

function TypewriterText({ text, speed = 25 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      {!done && <span className="blink-cursor" />}
    </span>
  );
}

function formatTime() {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function TerminalPanel({ lines, isProcessing, onExecuteCommand }: TerminalPanelProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [commandInput, setCommandInput] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim() || isProcessing) return;
    if (onExecuteCommand) {
      onExecuteCommand(commandInput.trim());
    }
    setCommandInput('');
  };

  return (
    <div className="terminal-panel" style={{ position: 'relative' }}>
      {/* Header */}
      <div className="terminal-header">
        <div className="terminal-dot red" />
        <div className="terminal-dot yellow" />
        <div className="terminal-dot green" />
        <span className="terminal-title">quantale engine v1.0 — live computation</span>
      </div>

      {/* Body */}
      <div className="terminal-body" ref={bodyRef}>
        <AnimatePresence mode="popLayout">
          {lines.map((line, i) => (
            <motion.div
              key={line.id}
              className="terminal-line"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.02 }}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <span className="terminal-timestamp">{line.timestamp}</span>
              <span className="terminal-prompt" style={{ color: getPromptColor(line.type) }}>
                {line.prompt || '>'}
              </span>
              <span className={`terminal-content ${line.type}`}>
                <TypewriterText text={line.content} speed={line.type === 'result' ? 40 : 20} />
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Input prompt when idle */}
        {!isProcessing && (
          <form onSubmit={handleSubmit} className="terminal-input-form">
            <span className="terminal-timestamp">{mounted ? formatTime() : '--:--:--'}</span>
            <span className="terminal-prompt" style={{ color: 'var(--terminal-text)' }}>{'>'}</span>
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              className="terminal-input"
              placeholder="Type query: e.g. le(advanced, grandmaster) or residual(advanced, master)..."
              disabled={isProcessing}
              autoFocus
            />
          </form>
        )}

        {/* Processing indicator */}
        {isProcessing && (
          <motion.div
            className="terminal-line"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="terminal-timestamp">{mounted ? formatTime() : '--:--:--'}</span>
            <span className="terminal-prompt" style={{ color: 'var(--terminal-accent)' }}>⟳</span>
            <span className="terminal-content system">computing...</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function getPromptColor(type: TerminalLine['type']): string {
  switch (type) {
    case 'error': return 'var(--terminal-error)';
    case 'warn': return 'var(--terminal-warn)';
    case 'accent': return 'var(--terminal-accent)';
    case 'result': return '#fff';
    case 'system': return 'var(--terminal-system)';
    default: return 'var(--terminal-text)';
  }
}
