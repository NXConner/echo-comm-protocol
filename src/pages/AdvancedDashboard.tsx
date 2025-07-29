import React, { useState, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import StatusRing from '@/components/StatusRing';
import HUDPanel from '@/components/HUDPanel';
import Terminal from '@/components/Terminal';
import HologramDisplay from '@/components/HologramDisplay';
import DataVisualization from '@/components/DataVisualization';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const AdvancedDashboard = () => {
  const { theme, setTheme, themes, particles, setParticles, animations, setAnimations, glitchMode, setGlitchMode } = useTheme();
  const [systemMetrics, setSystemMetrics] = useState({
    power: 87,
    network: 94,
    security: 76,
    efficiency: 92,
    quantum: 68,
    neural: 85
  });

  const [missionStatus, setMissionStatus] = useState([
    { id: 'ALPHA', name: 'NETWORK_INFILTRATION', progress: 75, status: 'active', priority: 'high' },
    { id: 'BETA', name: 'DATA_EXTRACTION', progress: 45, status: 'pending', priority: 'critical' },
    { id: 'GAMMA', name: 'SURVEILLANCE_OP', progress: 90, status: 'active', priority: 'medium' },
    { id: 'DELTA', name: 'CYBER_WARFARE', progress: 100, status: 'completed', priority: 'high' },
  ]);

  const [threatLevel, setThreatLevel] = useState('MODERATE');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate real-time metric updates
      setSystemMetrics(prev => ({
        power: Math.max(60, Math.min(100, prev.power + (Math.random() - 0.5) * 2)),
        network: Math.max(70, Math.min(100, prev.network + (Math.random() - 0.5) * 3)),
        security: Math.max(50, Math.min(100, prev.security + (Math.random() - 0.5) * 1.5)),
        efficiency: Math.max(80, Math.min(100, prev.efficiency + (Math.random() - 0.5) * 1)),
        quantum: Math.max(30, Math.min(100, prev.quantum + (Math.random() - 0.5) * 4)),
        neural: Math.max(70, Math.min(100, prev.neural + (Math.random() - 0.5) * 2))
      }));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const initiateTacticalScan = () => {
    setThreatLevel('SCANNING...');
    setTimeout(() => {
      const levels = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'];
      setThreatLevel(levels[Math.floor(Math.random() * levels.length)]);
    }, 3000);
  };

  const activateGhostProtocol = () => {
    setGlitchMode(!glitchMode);
  };

  return (
    <div className="min-h-screen pt-20 p-6 space-y-6">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center space-x-4">
          <h1 className="hud-text text-2xl font-bold tracking-widest glitch" data-text="TACTICAL_COMMAND_CENTER">
            TACTICAL_COMMAND_CENTER
          </h1>
          <Badge className={`${glitchMode ? 'bg-rogue-red/20 text-rogue-red border-rogue-red/30' : 'bg-primary/20 text-primary border-primary/30'}`}>
            {glitchMode ? 'GHOST_PROTOCOL' : 'OPERATIONAL'}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">THEME:</span>
            <Select value={theme} onValueChange={handleThemeChange}>
              <SelectTrigger className="w-40 tactical-button">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themes.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">PARTICLES:</span>
            <Switch checked={particles} onCheckedChange={setParticles} />
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">ANIMATIONS:</span>
            <Switch checked={animations} onCheckedChange={setAnimations} />
          </div>
        </div>
      </div>

      {/* System Status Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <StatusRing value={systemMetrics.power} label="POWER" />
        <StatusRing value={systemMetrics.network} label="NETWORK" color="cyan" />
        <StatusRing value={systemMetrics.security} label="SECURITY" color="orange" />
        <StatusRing value={systemMetrics.efficiency} label="EFFICIENCY" />
        <StatusRing value={systemMetrics.quantum} label="QUANTUM" color="cyan" />
        <StatusRing value={systemMetrics.neural} label="NEURAL_NET" color="red" />
      </div>

      {/* Main Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Advanced System Overview */}
        <HUDPanel title="SYSTEM_OVERVIEW" className="lg:col-span-2" glitch={glitchMode}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="terminal-text text-muted-foreground">AGENT_ID:</span>
                <span className="hud-text">ECHO_001_OMEGA</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="terminal-text text-muted-foreground">CLEARANCE:</span>
                <Badge className="tactical-button">QUANTUM_TACTICAL</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="terminal-text text-muted-foreground">ACTIVE_MISSIONS:</span>
                <span className="status-active">{missionStatus.filter(m => m.status === 'active').length} OPERATIONAL</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="terminal-text text-muted-foreground">UPTIME:</span>
                <span className="hud-text">127:45:33</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="terminal-text text-muted-foreground">NEURAL_LINK:</span>
                <span className="status-active">SYNCHRONIZED</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="terminal-text text-muted-foreground">SECTOR:</span>
                <span className="hud-text">OMEGA_PRIME</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="terminal-text text-muted-foreground">THREAT_LEVEL:</span>
                <span className={`${
                  threatLevel === 'LOW' ? 'status-active' :
                  threatLevel === 'MODERATE' ? 'status-alert' :
                  threatLevel === 'HIGH' ? 'status-critical' :
                  threatLevel === 'CRITICAL' ? 'status-critical glitch' :
                  'text-primary'
                }`}>
                  {threatLevel}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="terminal-text text-muted-foreground">QUANTUM_SYNC:</span>
                <span className="status-active">ENTANGLED</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="terminal-text text-muted-foreground">MODE:</span>
                <span className="hud-text">{glitchMode ? 'GHOST_PROTOCOL' : 'TACTICAL_ENHANCED'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="terminal-text text-muted-foreground">AI_STATUS:</span>
                <span className="status-active">CORTANA_ONLINE</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-3">
            <Button 
              className="tactical-button"
              onClick={initiateTacticalScan}
            >
              TACTICAL_SCAN
            </Button>
            <Button 
              className="tactical-button"
              onClick={activateGhostProtocol}
            >
              {glitchMode ? 'DISABLE_GHOST' : 'GHOST_PROTOCOL'}
            </Button>
            <Button className="tactical-button">
              NEURAL_ENHANCE
            </Button>
            <Button className="tactical-button">
              QUANTUM_JUMP
            </Button>
          </div>
        </HUDPanel>

        {/* Mission Status */}
        <HUDPanel title="MISSION_STATUS">
          <div className="space-y-4">
            {missionStatus.map((mission) => (
              <div key={mission.id} className="hud-panel p-3 border border-primary/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="hud-text text-sm">{mission.id}_{mission.name}</span>
                  <Badge className={`${
                    mission.status === 'active' ? 'bg-primary/20 text-primary border-primary/30' :
                    mission.status === 'completed' ? 'bg-terminal-green/20 text-terminal-green border-terminal-green/30' :
                    'bg-tactical-orange/20 text-tactical-orange border-tactical-orange/30'
                  }`}>
                    {mission.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  Priority: {mission.priority.toUpperCase()}
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      mission.status === 'completed' ? 'bg-terminal-green' : 'bg-primary'
                    }`}
                    style={{ width: `${mission.progress}%` }}
                  ></div>
                </div>
                <div className="text-right text-xs text-muted-foreground mt-1">
                  {mission.progress}%
                </div>
              </div>
            ))}
          </div>
        </HUDPanel>
      </div>

      {/* Advanced Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <HologramDisplay 
          title="NETWORK_TOPOLOGY" 
          model="network" 
          size="md" 
          glitch={glitchMode}
        />
        <HologramDisplay 
          title="DATA_MATRIX" 
          model="data_matrix" 
          size="md" 
          rotation={animations}
        />
        <DataVisualization 
          type="network_traffic" 
          title="NETWORK_TRAFFIC"
          realTime={true}
          height="280px"
        />
        <DataVisualization 
          type="threat_analysis" 
          title="THREAT_RADAR"
          realTime={true}
          height="280px"
        />
      </div>

      {/* Terminal and Advanced Controls */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Terminal 
          title="TACTICAL_TERMINAL"
          height="500px"
          enableAI={true}
          dataStream={true}
        />
        
        <div className="space-y-6">
          <DataVisualization 
            type="system_metrics" 
            title="SYSTEM_PERFORMANCE"
            realTime={true}
            height="240px"
          />
          <DataVisualization 
            type="mission_progress" 
            title="MISSION_ANALYTICS"
            height="240px"
          />
        </div>
      </div>

      {/* Enhanced System Time */}
      <div className="fixed bottom-6 right-6">
        <div className="hud-panel p-4 holographic">
          <div className="text-center">
            <div className="hud-text text-xl font-bold mb-1">
              {currentTime.toLocaleTimeString('en-US', { hour12: false })}
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              {currentTime.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
              SYNC: QUANTUM_CORE
            </Badge>
          </div>
        </div>
      </div>

      {/* Floating Tactical Menu */}
      <div className="fixed bottom-6 left-6">
        <div className="hud-panel p-3">
          <div className="flex space-x-2">
            <Button size="sm" className="tactical-button">
              ALERT_STATUS
            </Button>
            <Button size="sm" className="tactical-button">
              COMMS
            </Button>
            <Button size="sm" className="tactical-button">
              INTEL
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedDashboard;