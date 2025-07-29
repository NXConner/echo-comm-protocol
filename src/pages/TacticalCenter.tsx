import React, { useState, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import HUDPanel from '@/components/HUDPanel';
import HologramDisplay from '@/components/HologramDisplay';
import DataVisualization from '@/components/DataVisualization';
import Terminal from '@/components/Terminal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TacticalCenter = () => {
  const { glitchMode } = useTheme();
  const [activeOperations, setActiveOperations] = useState(3);
  const [threatAlerts, setThreatAlerts] = useState([
    { id: 1, level: 'HIGH', location: 'SECTOR_7', description: 'Unauthorized network access detected' },
    { id: 2, level: 'MEDIUM', location: 'SECTOR_3', description: 'Suspicious movement patterns' },
    { id: 3, level: 'CRITICAL', location: 'SECTOR_1', description: 'Security breach in progress' },
  ]);

  const [communicationChannels] = useState([
    { id: 'ALPHA', frequency: '156.500', status: 'active', type: 'COMMAND' },
    { id: 'BRAVO', frequency: '162.775', status: 'standby', type: 'TACTICAL' },
    { id: 'CHARLIE', frequency: '154.365', status: 'encrypted', type: 'INTEL' },
    { id: 'DELTA', frequency: '159.420', status: 'active', type: 'EMERGENCY' },
  ]);

  const [mapData, setMapData] = useState({
    agents: [
      { id: 'ECHO_001', x: 45, y: 60, status: 'active', mission: 'INFILTRATION' },
      { id: 'FOXTROT_002', x: 78, y: 34, status: 'standby', mission: 'SURVEILLANCE' },
      { id: 'GOLF_003', x: 23, y: 85, status: 'engaged', mission: 'EXTRACTION' },
    ],
    objectives: [
      { id: 'OBJ_A', x: 50, y: 30, type: 'primary', status: 'pending' },
      { id: 'OBJ_B', x: 80, y: 70, type: 'secondary', status: 'complete' },
      { id: 'OBJ_C', x: 20, y: 45, type: 'intel', status: 'active' },
    ],
    threats: [
      { id: 'THR_1', x: 65, y: 25, level: 'high', type: 'hostile' },
      { id: 'THR_2', x: 35, y: 80, level: 'medium', type: 'unknown' },
    ]
  });

  useEffect(() => {
    // Simulate real-time map updates
    const interval = setInterval(() => {
      setMapData(prev => ({
        ...prev,
        agents: prev.agents.map(agent => ({
          ...agent,
          x: Math.max(5, Math.min(95, agent.x + (Math.random() - 0.5) * 3)),
          y: Math.max(5, Math.min(95, agent.y + (Math.random() - 0.5) * 3))
        }))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const TacticalMap = () => (
    <div className="relative w-full h-80 bg-card border border-primary/30 rounded network-grid">
      <div className="absolute inset-0 p-4">
        <div className="text-xs text-muted-foreground mb-2">TACTICAL_OVERVIEW - GRID_REF: OMEGA_PRIME</div>
        
        {/* Grid overlay */}
        <div className="absolute inset-4 opacity-30">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`h-${i}`} className="absolute border-t border-cyber-cyan/20" style={{ top: `${i * 10}%`, width: '100%' }} />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`v-${i}`} className="absolute border-l border-cyber-cyan/20" style={{ left: `${i * 10}%`, height: '100%' }} />
          ))}
        </div>

        {/* Agents */}
        {mapData.agents.map((agent) => (
          <div
            key={agent.id}
            className={`absolute w-3 h-3 rounded-full border-2 ${
              agent.status === 'active' ? 'bg-terminal-green border-terminal-green' :
              agent.status === 'engaged' ? 'bg-rogue-red border-rogue-red' :
              'bg-tactical-orange border-tactical-orange'
            } status-active`}
            style={{ left: `${agent.x}%`, top: `${agent.y}%` }}
            title={`${agent.id} - ${agent.mission}`}
          />
        ))}

        {/* Objectives */}
        {mapData.objectives.map((obj) => (
          <div
            key={obj.id}
            className={`absolute w-4 h-4 border-2 ${
              obj.type === 'primary' ? 'border-primary bg-primary/20' :
              obj.type === 'secondary' ? 'border-cyber-cyan bg-cyber-cyan/20' :
              'border-neon-purple bg-neon-purple/20'
            } rotate-45`}
            style={{ left: `${obj.x}%`, top: `${obj.y}%` }}
            title={`${obj.id} - ${obj.type}`}
          />
        ))}

        {/* Threats */}
        {mapData.threats.map((threat) => (
          <div
            key={threat.id}
            className={`absolute w-5 h-5 border-2 border-rogue-red bg-rogue-red/30 rounded-full animate-pulse`}
            style={{ left: `${threat.x}%`, top: `${threat.y}%` }}
            title={`${threat.id} - ${threat.level} threat`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className={`hud-text text-2xl font-bold tracking-widest ${glitchMode ? 'glitch' : ''}`} data-text="TACTICAL_COMMAND_CENTER">
          TACTICAL_COMMAND_CENTER
        </h1>
        <div className="flex items-center space-x-4">
          <Badge className="bg-primary/20 text-primary border-primary/30">
            OPERATIONS: {activeOperations} ACTIVE
          </Badge>
          <Badge className="bg-rogue-red/20 text-rogue-red border-rogue-red/30">
            ALERTS: {threatAlerts.length}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 tactical-button">
          <TabsTrigger value="overview">TACTICAL_OVERVIEW</TabsTrigger>
          <TabsTrigger value="communications">COMMUNICATIONS</TabsTrigger>
          <TabsTrigger value="intelligence">INTELLIGENCE</TabsTrigger>
          <TabsTrigger value="operations">OPERATIONS</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HUDPanel title="TACTICAL_MAP" className="lg:col-span-1">
              <TacticalMap />
              <div className="mt-4 flex justify-between text-xs">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-terminal-green"></div>
                    <span>AGENTS</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 border border-primary bg-primary/20"></div>
                    <span>OBJECTIVES</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-rogue-red"></div>
                    <span>THREATS</span>
                  </div>
                </div>
                <Button size="sm" className="tactical-button">
                  REFRESH_MAP
                </Button>
              </div>
            </HUDPanel>

            <div className="space-y-6">
              <HUDPanel title="THREAT_ALERTS">
                <div className="space-y-3">
                  {threatAlerts.map((alert) => (
                    <div key={alert.id} className="hud-panel p-3 border border-rogue-red/20">
                      <div className="flex justify-between items-center mb-1">
                        <Badge className={`${
                          alert.level === 'CRITICAL' ? 'bg-rogue-red/20 text-rogue-red border-rogue-red/30' :
                          alert.level === 'HIGH' ? 'bg-alert-orange/20 text-alert-orange border-alert-orange/30' :
                          'bg-tactical-orange/20 text-tactical-orange border-tactical-orange/30'
                        }`}>
                          {alert.level}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{alert.location}</span>
                      </div>
                      <div className="text-sm text-foreground">{alert.description}</div>
                    </div>
                  ))}
                </div>
              </HUDPanel>

              <HologramDisplay 
                title="NETWORK_STATUS" 
                model="network" 
                size="sm" 
                glitch={glitchMode}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DataVisualization 
              type="threat_analysis" 
              title="THREAT_RADAR"
              realTime={true}
              height="250px"
            />
            <DataVisualization 
              type="network_traffic" 
              title="NETWORK_ACTIVITY"
              realTime={true}
              height="250px"
            />
            <DataVisualization 
              type="system_metrics" 
              title="SYSTEM_STATUS"
              realTime={true}
              height="250px"
            />
          </div>
        </TabsContent>

        <TabsContent value="communications" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HUDPanel title="COMMUNICATION_CHANNELS">
              <div className="space-y-4">
                {communicationChannels.map((channel) => (
                  <div key={channel.id} className="hud-panel p-3 border border-primary/20 flex justify-between items-center">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="hud-text">{channel.id}</span>
                        <Badge className={`${
                          channel.status === 'active' ? 'bg-terminal-green/20 text-terminal-green border-terminal-green/30' :
                          channel.status === 'encrypted' ? 'bg-neon-purple/20 text-neon-purple border-neon-purple/30' :
                          'bg-muted/20 text-muted-foreground border-muted/30'
                        }`}>
                          {channel.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {channel.frequency} MHz - {channel.type}
                      </div>
                    </div>
                    <Button size="sm" className="tactical-button">
                      CONNECT
                    </Button>
                  </div>
                ))}
              </div>
            </HUDPanel>

            <Terminal 
              title="SECURE_COMMUNICATIONS"
              height="400px"
              enableAI={true}
              dataStream={false}
            />
          </div>
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HologramDisplay 
              title="INTELLIGENCE_ANALYSIS" 
              model="data_matrix" 
              size="lg" 
              rotation={true}
            />
            <div className="space-y-6">
              <DataVisualization 
                type="real_time_data" 
                title="INTEL_FEED"
                realTime={true}
                height="200px"
              />
              <HUDPanel title="RECENT_INTELLIGENCE">
                <div className="space-y-2 text-sm">
                  <div className="terminal-text">
                    <span className="text-primary">[CLASSIFIED]</span> New target identified in Sector 7
                  </div>
                  <div className="terminal-text">
                    <span className="text-cyber-cyan">[INTEL]</span> Communication patterns suggest coordinated activity
                  </div>
                  <div className="terminal-text">
                    <span className="text-alert-orange">[ALERT]</span> Potential security breach detected
                  </div>
                  <div className="terminal-text">
                    <span className="text-terminal-green">[CONFIRMED]</span> Asset extraction successful
                  </div>
                </div>
              </HUDPanel>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          <Terminal 
            title="OPERATIONS_TERMINAL"
            height="600px"
            enableAI={true}
            dataStream={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TacticalCenter;