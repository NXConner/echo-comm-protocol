import React, { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';

interface TerminalCommand {
  command: string;
  output: string[];
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface TerminalProps {
  title?: string;
  height?: string;
  enableAI?: boolean;
  dataStream?: boolean;
}

const Terminal: React.FC<TerminalProps> = ({ 
  title = "TERMINAL_INTERFACE", 
  height = "400px",
  enableAI = false,
  dataStream = false 
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalCommand[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentDir, setCurrentDir] = useState('/sys/tactical/echo_001');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = {
    help: () => ({
      output: [
        'AVAILABLE COMMANDS:',
        '  status    - System status overview',
        '  scan      - Network security scan',
        '  decrypt   - Decrypt encrypted data',
        '  trace     - Trace network connections',
        '  stealth   - Toggle stealth mode',
        '  mission   - Mission briefing',
        '  upload    - Upload tactical data',
        '  clear     - Clear terminal',
        '  exit      - Terminate session'
      ],
      type: 'info' as const
    }),
    status: () => ({
      output: [
        'SYSTEM STATUS: OPERATIONAL',
        '├─ POWER: 87% NOMINAL',
        '├─ NETWORK: SECURE CONNECTION',
        '├─ ENCRYPTION: AES-256 ACTIVE',
        '├─ FIREWALL: ENABLED',
        '└─ AGENT STATUS: ACTIVE'
      ],
      type: 'success' as const
    }),
    scan: () => ({
      output: [
        'INITIATING NETWORK SCAN...',
        'Scanning range: 192.168.1.0/24',
        '████████████████ 100%',
        '',
        'SCAN RESULTS:',
        '├─ 192.168.1.1  ROUTER      [SECURE]',
        '├─ 192.168.1.15 WORKSTATION [VULNERABLE]',
        '├─ 192.168.1.23 SERVER      [ENCRYPTED]',
        '└─ 192.168.1.45 UNKNOWN     [SUSPICIOUS]',
        '',
        'THREAT LEVEL: MODERATE'
      ],
      type: 'warning' as const
    }),
    decrypt: () => ({
      output: [
        'DECRYPTION MODULE ACTIVATED',
        'Target: encrypted_data.enc',
        'Method: Quantum-resistant algorithm',
        '',
        'Decrypting... ████████████ 100%',
        '',
        'DECRYPTION SUCCESSFUL',
        'Contents: [CLASSIFIED]',
        'Clearance Level: TACTICAL REQUIRED'
      ],
      type: 'success' as const
    }),
    stealth: () => ({
      output: [
        'STEALTH MODE TOGGLED',
        'Network signature minimized',
        'Thermal dampening active',
        'Electronic countermeasures online',
        'Status: GHOST PROTOCOL ENGAGED'
      ],
      type: 'info' as const
    }),
    mission: () => ({
      output: [
        'MISSION BRIEFING - CLASSIFIED',
        '═══════════════════════════',
        'Operation: SHADOW_EXTRACTION',
        'Objective: Infiltrate secure facility',
        'Target: Data center Level-7',
        'Timeline: 72 hours',
        'Support: Echo team on standby',
        '',
        'GOOD HUNTING, AGENT.'
      ],
      type: 'info' as const
    }),
    clear: () => {
      setHistory([]);
      return { output: [], type: 'info' as const };
    }
  };

  const commandList = Object.keys(commands);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (dataStream) {
      const interval = setInterval(() => {
        const dataStreams = [
          'DATA_STREAM: Network packet intercepted',
          'INTEL_FEED: New target identified',
          'SECURITY_ALERT: Unauthorized access attempt',
          'COMM_LINK: Message from HQ received',
          'SYSTEM_LOG: Backup completed successfully'
        ];
        const randomStream = dataStreams[Math.floor(Math.random() * dataStreams.length)];
        addSystemMessage(randomStream, 'info');
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [dataStream]);

  const addSystemMessage = (message: string, type: TerminalCommand['type']) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setHistory(prev => [...prev, {
      command: 'SYSTEM',
      output: [message],
      timestamp,
      type
    }]);
  };

  const processCommand = async (cmd: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setIsProcessing(true);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

    const command = cmd.toLowerCase().trim();
    let result;

    if (commands[command as keyof typeof commands]) {
      result = commands[command as keyof typeof commands]();
    } else if (command.startsWith('cd ')) {
      const newDir = command.substring(3);
      setCurrentDir(newDir);
      result = { output: [`Directory changed to: ${newDir}`], type: 'info' as const };
    } else if (command === 'pwd') {
      result = { output: [currentDir], type: 'info' as const };
    } else if (command === 'ls') {
      result = { 
        output: [
          'tactical_data/', 
          'mission_files/', 
          'encrypted_keys/', 
          'network_logs.txt',
          'agent_profile.dat'
        ], 
        type: 'info' as const 
      };
    } else {
      result = { 
        output: [`Command not found: ${cmd}`, 'Type "help" for available commands'], 
        type: 'error' as const 
      };
    }

    setHistory(prev => [...prev, {
      command: cmd,
      output: result.output,
      timestamp,
      type: result.type
    }]);

    setIsProcessing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      processCommand(input);
      setInput('');
      setSuggestions([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    // Auto-suggestions
    if (value.trim()) {
      const filtered = commandList.filter(cmd => 
        cmd.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  return (
    <div className="hud-panel p-0 overflow-hidden data-stream" style={{ height }}>
      <div className="border-b border-primary/30 p-3 bg-secondary/20">
        <div className="flex items-center justify-between">
          <h3 className="hud-text font-bold tracking-widest">{title}</h3>
          <div className="flex items-center space-x-2">
            {enableAI && (
              <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple/30">
                AI_ASSIST
              </Badge>
            )}
            {dataStream && (
              <Badge className="bg-terminal-green/20 text-terminal-green border-terminal-green/30 status-active">
                LIVE_FEED
              </Badge>
            )}
            <Badge className="bg-primary/20 text-primary border-primary/30">
              SECURE
            </Badge>
          </div>
        </div>
      </div>

      <div 
        ref={terminalRef}
        className="p-4 overflow-y-auto flex-1 terminal-text text-sm bg-background/50"
        style={{ height: 'calc(100% - 120px)' }}
      >
        {history.map((entry, index) => (
          <div key={index} className="mb-3">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-muted-foreground">[{entry.timestamp}]</span>
              <span className="text-primary">echo_001@tactical:~$</span>
              <span className="text-foreground">{entry.command}</span>
            </div>
            {entry.output.map((line, lineIndex) => (
              <div 
                key={lineIndex} 
                className={`ml-4 ${
                  entry.type === 'error' ? 'text-rogue-red' :
                  entry.type === 'warning' ? 'text-alert-orange' :
                  entry.type === 'success' ? 'text-terminal-green' :
                  'text-foreground'
                }`}
              >
                {line}
              </div>
            ))}
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex items-center space-x-2 text-primary">
            <span>Processing</span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-primary rounded-full animate-ping"></div>
              <div className="w-1 h-1 bg-primary rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-1 bg-primary rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="border-t border-primary/30 p-2 bg-secondary/20">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="tactical-button px-2 py-1 text-xs"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="border-t border-primary/30 p-3 bg-secondary/20">
        <div className="flex items-center space-x-2">
          <span className="text-primary terminal-text">echo_001@tactical:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            className="flex-1 bg-transparent border-none outline-none text-foreground terminal-text terminal-cursor"
            placeholder="Enter command..."
            disabled={isProcessing}
          />
          {isProcessing && (
            <div className="text-primary">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Terminal;