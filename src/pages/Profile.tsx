import { useState } from 'react';
import HUDPanel from '@/components/HUDPanel';
import StatusRing from '@/components/StatusRing';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const Profile = () => {
  const [agent, setAgent] = useState({
    callsign: 'ECHO_001',
    rank: 'TACTICAL_AGENT',
    clearanceLevel: 'ALPHA',
    xp: 2847,
    missionsCompleted: 12,
    efficiency: 87,
    reputation: 94
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempCallsign, setTempCallsign] = useState(agent.callsign);

  const achievements = [
    { name: 'FIRST_MISSION', description: 'Complete your first mission', unlocked: true },
    { name: 'STEALTH_MASTER', description: 'Complete 5 missions without detection', unlocked: true },
    { name: 'SPEED_DEMON', description: 'Complete a mission in under 1 hour', unlocked: true },
    { name: 'PERFECTIONIST', description: '100% completion on 3 missions', unlocked: false },
    { name: 'ROGUE_HUNTER', description: 'Detect and neutralize rogue activity', unlocked: false },
    { name: 'NETWORK_GHOST', description: 'Infiltrate 10 secure networks', unlocked: false }
  ];

  const updateCallsign = () => {
    if (tempCallsign.trim()) {
      setAgent({ ...agent, callsign: tempCallsign.toUpperCase() });
      setIsEditing(false);
    }
  };

  const getRankProgress = () => {
    const nextRankXP = 3000;
    return Math.min((agent.xp / nextRankXP) * 100, 100);
  };

  return (
    <div className="min-h-screen pt-20 p-6 space-y-6">
      <h1 className="hud-text text-2xl font-bold tracking-widest">AGENT_PROFILE</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Info */}
        <div className="lg:col-span-2 space-y-6">
          <HUDPanel title="AGENT_IDENTIFICATION">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="hud-text text-sm">CALLSIGN:</label>
                  {isEditing ? (
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        value={tempCallsign}
                        onChange={(e) => setTempCallsign(e.target.value)}
                        className="bg-secondary border-primary/30 text-primary"
                        placeholder="Enter callsign..."
                      />
                      <Button size="sm" className="tactical-button" onClick={updateCallsign}>
                        SAVE
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-muted text-muted-foreground"
                        onClick={() => {
                          setTempCallsign(agent.callsign);
                          setIsEditing(false);
                        }}
                      >
                        CANCEL
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="hud-text text-lg font-bold">{agent.callsign}</span>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="tactical-button"
                        onClick={() => setIsEditing(true)}
                      >
                        EDIT
                      </Button>
                    </div>
                  )}
                </div>
                <div className="status-ring w-16 h-16 flex items-center justify-center">
                  <span className="hud-text text-xs">ID</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground text-sm">RANK:</span>
                  <div className="mt-1">
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      {agent.rank}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">CLEARANCE:</span>
                  <div className="mt-1">
                    <Badge className="bg-tactical-cyan/20 text-tactical-cyan border-tactical-cyan/30">
                      {agent.clearanceLevel}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">XP:</span>
                  <div className="hud-text font-bold">{agent.xp.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">MISSIONS:</span>
                  <div className="hud-text font-bold">{agent.missionsCompleted}</div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">RANK PROGRESS:</span>
                  <span className="hud-text">{Math.round(getRankProgress())}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getRankProgress()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </HUDPanel>

          <HUDPanel title="ACHIEVEMENTS">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className={`hud-panel p-3 border ${
                    achievement.unlocked 
                      ? 'border-primary/30 bg-primary/5' 
                      : 'border-muted/30 bg-muted/5'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded border-2 flex items-center justify-center ${
                      achievement.unlocked 
                        ? 'border-primary bg-primary/20' 
                        : 'border-muted bg-muted/20'
                    }`}>
                      {achievement.unlocked ? (
                        <span className="text-primary">✓</span>
                      ) : (
                        <span className="text-muted-foreground">?</span>
                      )}
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm ${
                        achievement.unlocked ? 'text-primary' : 'text-muted-foreground'
                      }`}>
                        {achievement.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </HUDPanel>
        </div>

        {/* Stats */}
        <div className="space-y-6">
          <HUDPanel title="PERFORMANCE_METRICS">
            <div className="space-y-6">
              <StatusRing value={agent.efficiency} label="EFFICIENCY" />
              <StatusRing value={agent.reputation} label="REPUTATION" color="cyan" />
              <StatusRing value={75} label="STEALTH" color="orange" />
            </div>
          </HUDPanel>

          <HUDPanel title="SYSTEM_SETTINGS">
            <div className="space-y-4">
              <Button className="w-full tactical-button">
                VOICE_CALIBRATION
              </Button>
              <Button className="w-full tactical-button">
                THEME_SELECTION
              </Button>
              <Button className="w-full tactical-button">
                SECURITY_PROTOCOLS
              </Button>
              <Button className="w-full bg-tactical-red/20 text-tactical-red border-tactical-red/30 hover:bg-tactical-red/30">
                ENTER_ROGUE_MODE
              </Button>
            </div>
          </HUDPanel>
        </div>
      </div>
    </div>
  );
};

export default Profile;