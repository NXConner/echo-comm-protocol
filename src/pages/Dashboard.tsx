import { useState, useEffect } from 'react';
import StatusRing from '@/components/StatusRing';
import HUDPanel from '@/components/HUDPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const [systemStatus, setSystemStatus] = useState({
    power: 87,
    network: 94,
    security: 76,
    missions: 3
  });
  
  const [logs, setLogs] = useState([
    { time: '14:23:45', level: 'INFO', message: 'System initialization complete' },
    { time: '14:24:12', level: 'WARN', message: 'Network latency detected: 45ms' },
    { time: '14:24:33', level: 'INFO', message: 'Mission sync successful' },
    { time: '14:25:01', level: 'INFO', message: 'Agent status: ACTIVE' }
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const addLog = (level: string, message: string) => {
    const newLog = {
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      level,
      message
    };
    setLogs(prev => [newLog, ...prev.slice(0, 9)]);
  };

  return (
    <div className="min-h-screen pt-20 p-6 space-y-6">
      {/* Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatusRing value={systemStatus.power} label="POWER" />
        <StatusRing value={systemStatus.network} label="NETWORK" color="cyan" />
        <StatusRing value={systemStatus.security} label="SECURITY" color="orange" />
        <StatusRing value={85} label="EFFICIENCY" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Overview */}
        <HUDPanel title="SYSTEM_OVERVIEW" className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="terminal-text text-muted-foreground">AGENT_ID:</span>
                <span className="hud-text">ECHO_001</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="terminal-text text-muted-foreground">CLEARANCE:</span>
                <Badge className="tactical-button">TACTICAL</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="terminal-text text-muted-foreground">MISSIONS:</span>
                <span className="status-active">{systemStatus.missions} ACTIVE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="terminal-text text-muted-foreground">UPTIME:</span>
                <span className="hud-text">72:14:33</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="terminal-text text-muted-foreground">ZONE:</span>
                <span className="hud-text">SECTOR_7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="terminal-text text-muted-foreground">THREAT_LVL:</span>
                <span className="status-alert">MODERATE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="terminal-text text-muted-foreground">SYNC:</span>
                <span className="status-active">ONLINE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="terminal-text text-muted-foreground">MODE:</span>
                <span className="hud-text">TACTICAL</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex space-x-3">
            <Button 
              className="tactical-button"
              onClick={() => addLog('INFO', 'Manual system scan initiated')}
            >
              SCAN_SYSTEM
            </Button>
            <Button 
              className="tactical-button"
              onClick={() => addLog('WARN', 'Entering stealth mode')}
            >
              STEALTH_MODE
            </Button>
          </div>
        </HUDPanel>

        {/* Mission Status */}
        <HUDPanel title="MISSION_STATUS">
          <div className="space-y-4">
            <div className="hud-panel p-3 border border-primary/20">
              <div className="flex justify-between items-center mb-2">
                <span className="hud-text text-sm">ALPHA_PROTOCOL</span>
                <Badge className="bg-primary/20 text-primary border-primary/30">ACTIVE</Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Security assessment in progress...
              </div>
              <div className="mt-2 w-full bg-muted rounded-full h-1">
                <div className="bg-primary h-1 rounded-full w-3/4"></div>
              </div>
            </div>
            
            <div className="hud-panel p-3 border border-tactical-orange/20">
              <div className="flex justify-between items-center mb-2">
                <span className="hud-text text-sm">BETA_SCAN</span>
                <Badge className="bg-tactical-orange/20 text-tactical-orange border-tactical-orange/30">PENDING</Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Network infiltration queued
              </div>
            </div>
            
            <div className="hud-panel p-3 border border-tactical-cyan/20">
              <div className="flex justify-between items-center mb-2">
                <span className="hud-text text-sm">GAMMA_INTEL</span>
                <Badge className="bg-tactical-cyan/20 text-tactical-cyan border-tactical-cyan/30">STANDBY</Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Data extraction ready
              </div>
            </div>
          </div>
        </HUDPanel>
      </div>

      {/* Command Log */}
      <HUDPanel title="COMMAND_LOG">
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="flex items-center space-x-4 text-sm font-mono">
              <span className="text-muted-foreground">[{log.time}]</span>
              <Badge 
                className={`text-xs ${
                  log.level === 'INFO' ? 'bg-primary/20 text-primary' :
                  log.level === 'WARN' ? 'bg-tactical-orange/20 text-tactical-orange' :
                  'bg-tactical-red/20 text-tactical-red'
                }`}
              >
                {log.level}
              </Badge>
              <span className="text-foreground">{log.message}</span>
            </div>
          ))}
        </div>
      </HUDPanel>

      {/* System Time */}
      <div className="fixed bottom-6 right-6">
        <div className="hud-panel p-3">
          <div className="text-center">
            <div className="hud-text text-lg font-bold">
              {currentTime.toLocaleTimeString('en-US', { hour12: false })}
            </div>
            <div className="text-xs text-muted-foreground">
              {currentTime.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;