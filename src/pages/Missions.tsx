import { useState } from 'react';
import HUDPanel from '@/components/HUDPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Mission {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'pending' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  assignedAgent: string;
  deadline: string;
  objectives: string[];
}

const Missions = () => {
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: 'ALPHA_001',
      title: 'NETWORK_INFILTRATION',
      description: 'Penetrate target network infrastructure and extract sensitive data',
      status: 'active',
      priority: 'high',
      progress: 75,
      assignedAgent: 'ECHO_001',
      deadline: '2024-07-30',
      objectives: ['Access main server', 'Extract database', 'Cover tracks']
    },
    {
      id: 'BETA_002',
      title: 'SURVEILLANCE_OP',
      description: 'Monitor target location for suspicious activity patterns',
      status: 'pending',
      priority: 'medium',
      progress: 0,
      assignedAgent: 'ECHO_001',
      deadline: '2024-08-01',
      objectives: ['Set up surveillance', 'Monitor 72 hours', 'Report findings']
    },
    {
      id: 'GAMMA_003',
      title: 'DATA_RECOVERY',
      description: 'Recover compromised data from secure facility systems',
      status: 'completed',
      priority: 'critical',
      progress: 100,
      assignedAgent: 'ECHO_001',
      deadline: '2024-07-25',
      objectives: ['Locate data cache', 'Decrypt files', 'Verify integrity']
    }
  ]);

  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [newMission, setNewMission] = useState({
    title: '',
    description: '',
    priority: 'medium' as Mission['priority'],
    deadline: ''
  });
  const [showNewMissionForm, setShowNewMissionForm] = useState(false);

  const getStatusColor = (status: Mission['status']) => {
    switch (status) {
      case 'active': return 'primary';
      case 'pending': return 'tactical-orange';
      case 'completed': return 'tactical-cyan';
      case 'failed': return 'tactical-red';
      default: return 'muted';
    }
  };

  const getPriorityColor = (priority: Mission['priority']) => {
    switch (priority) {
      case 'critical': return 'tactical-red';
      case 'high': return 'tactical-orange';
      case 'medium': return 'tactical-cyan';
      case 'low': return 'muted';
      default: return 'muted';
    }
  };

  const createMission = () => {
    if (!newMission.title || !newMission.description) return;
    
    const mission: Mission = {
      id: `MISSION_${Date.now().toString().slice(-3)}`,
      title: newMission.title.toUpperCase().replace(/\s+/g, '_'),
      description: newMission.description,
      status: 'pending',
      priority: newMission.priority,
      progress: 0,
      assignedAgent: 'ECHO_001',
      deadline: newMission.deadline,
      objectives: ['Initialize mission parameters', 'Execute primary objective', 'Complete mission report']
    };
    
    setMissions([mission, ...missions]);
    setNewMission({ title: '', description: '', priority: 'medium', deadline: '' });
    setShowNewMissionForm(false);
  };

  const updateMissionProgress = (missionId: string, newProgress: number) => {
    setMissions(missions.map(mission => 
      mission.id === missionId 
        ? { ...mission, progress: newProgress, status: newProgress === 100 ? 'completed' : 'active' }
        : mission
    ));
  };

  return (
    <div className="min-h-screen pt-20 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="hud-text text-2xl font-bold tracking-widest">MISSION_CONTROL</h1>
        <Button 
          className="tactical-button"
          onClick={() => setShowNewMissionForm(!showNewMissionForm)}
        >
          + NEW_MISSION
        </Button>
      </div>

      {showNewMissionForm && (
        <HUDPanel title="CREATE_MISSION">
          <div className="space-y-4">
            <div>
              <label className="hud-text text-sm">MISSION_TITLE</label>
              <Input
                value={newMission.title}
                onChange={(e) => setNewMission({...newMission, title: e.target.value})}
                className="mt-1 bg-secondary border-primary/30 text-primary"
                placeholder="Enter mission title..."
              />
            </div>
            <div>
              <label className="hud-text text-sm">DESCRIPTION</label>
              <Textarea
                value={newMission.description}
                onChange={(e) => setNewMission({...newMission, description: e.target.value})}
                className="mt-1 bg-secondary border-primary/30 text-primary"
                placeholder="Mission briefing and objectives..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="hud-text text-sm">PRIORITY</label>
                <select 
                  value={newMission.priority}
                  onChange={(e) => setNewMission({...newMission, priority: e.target.value as Mission['priority']})}
                  className="mt-1 w-full bg-secondary border border-primary/30 text-primary rounded p-2 text-sm"
                >
                  <option value="low">LOW</option>
                  <option value="medium">MEDIUM</option>
                  <option value="high">HIGH</option>
                  <option value="critical">CRITICAL</option>
                </select>
              </div>
              <div>
                <label className="hud-text text-sm">DEADLINE</label>
                <Input
                  type="date"
                  value={newMission.deadline}
                  onChange={(e) => setNewMission({...newMission, deadline: e.target.value})}
                  className="mt-1 bg-secondary border-primary/30 text-primary"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <Button className="tactical-button" onClick={createMission}>
                CREATE_MISSION
              </Button>
              <Button 
                variant="outline" 
                className="border-muted text-muted-foreground"
                onClick={() => setShowNewMissionForm(false)}
              >
                CANCEL
              </Button>
            </div>
          </div>
        </HUDPanel>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mission List */}
        <div className="lg:col-span-2 space-y-4">
          {missions.map((mission) => (
            <HUDPanel key={mission.id} title={`MISSION_${mission.id}`}>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="hud-text font-bold">{mission.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{mission.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={`bg-${getStatusColor(mission.status)}/20 text-${getStatusColor(mission.status)} border-${getStatusColor(mission.status)}/30`}>
                      {mission.status.toUpperCase()}
                    </Badge>
                    <Badge className={`bg-${getPriorityColor(mission.priority)}/20 text-${getPriorityColor(mission.priority)} border-${getPriorityColor(mission.priority)}/30`}>
                      {mission.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">PROGRESS:</span>
                    <span className="hud-text">{mission.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1">
                    <div 
                      className={`bg-${getStatusColor(mission.status)} h-1 rounded-full transition-all duration-300`}
                      style={{ width: `${mission.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">AGENT: {mission.assignedAgent}</span>
                  <span className="text-muted-foreground">DEADLINE: {mission.deadline}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    className="tactical-button"
                    onClick={() => setSelectedMission(mission)}
                  >
                    DETAILS
                  </Button>
                  {mission.status === 'active' && (
                    <>
                      <Button 
                        size="sm" 
                        className="tactical-button"
                        onClick={() => updateMissionProgress(mission.id, Math.min(mission.progress + 25, 100))}
                      >
                        UPDATE_PROGRESS
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </HUDPanel>
          ))}
        </div>

        {/* Mission Details */}
        <div>
          {selectedMission ? (
            <HUDPanel title="MISSION_DETAILS">
              <div className="space-y-4">
                <div>
                  <h3 className="hud-text font-bold">{selectedMission.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{selectedMission.description}</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="hud-text text-sm">OBJECTIVES:</h4>
                  <ul className="space-y-1">
                    {selectedMission.objectives.map((objective, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center">
                        <span className="text-primary mr-2">▸</span>
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">STATUS:</span>
                    <div className="mt-1">
                      <Badge className={`bg-${getStatusColor(selectedMission.status)}/20 text-${getStatusColor(selectedMission.status)}`}>
                        {selectedMission.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">PRIORITY:</span>
                    <div className="mt-1">
                      <Badge className={`bg-${getPriorityColor(selectedMission.priority)}/20 text-${getPriorityColor(selectedMission.priority)}`}>
                        {selectedMission.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full tactical-button"
                  onClick={() => setSelectedMission(null)}
                >
                  CLOSE_DETAILS
                </Button>
              </div>
            </HUDPanel>
          ) : (
            <HUDPanel title="SELECT_MISSION">
              <div className="text-center py-8">
                <div className="text-muted-foreground text-sm">
                  Select a mission to view detailed information
                </div>
              </div>
            </HUDPanel>
          )}
        </div>
      </div>
    </div>
  );
};

export default Missions;