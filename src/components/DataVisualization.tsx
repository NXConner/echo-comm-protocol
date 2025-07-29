import React, { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';

interface DataVisualizationProps {
  type: 'network_traffic' | 'system_metrics' | 'threat_analysis' | 'mission_progress' | 'real_time_data';
  title?: string;
  data?: any[];
  realTime?: boolean;
  height?: string;
}

interface DataPoint {
  timestamp: number;
  value: number;
  label?: string;
  color?: string;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({
  type,
  title,
  data = [],
  realTime = false,
  height = '300px'
}) => {
  const [currentData, setCurrentData] = useState<DataPoint[]>([]);
  const [isAnimating, setIsAnimating] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (realTime) {
      const interval = setInterval(() => {
        generateRealtimeData();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [realTime, type]);

  useEffect(() => {
    if (canvasRef.current && isAnimating) {
      drawVisualization();
    }
  }, [currentData, type, isAnimating]);

  const generateRealtimeData = () => {
    const timestamp = Date.now();
    const newPoint: DataPoint = {
      timestamp,
      value: Math.random() * 100,
      color: getColorForType(type)
    };

    setCurrentData(prev => {
      const updated = [...prev, newPoint];
      // Keep only last 50 points
      return updated.slice(-50);
    });
  };

  const getColorForType = (type: string): string => {
    switch (type) {
      case 'network_traffic': return '#00ffff';
      case 'system_metrics': return '#00ff00';
      case 'threat_analysis': return '#ff6600';
      case 'mission_progress': return '#ff00ff';
      default: return '#ffffff';
    }
  };

  const drawVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (type) {
      case 'network_traffic':
        drawNetworkTraffic(ctx, canvas.width, canvas.height);
        break;
      case 'system_metrics':
        drawSystemMetrics(ctx, canvas.width, canvas.height);
        break;
      case 'threat_analysis':
        drawThreatAnalysis(ctx, canvas.width, canvas.height);
        break;
      case 'mission_progress':
        drawMissionProgress(ctx, canvas.width, canvas.height);
        break;
      case 'real_time_data':
        drawRealtimeChart(ctx, canvas.width, canvas.height);
        break;
    }

    if (isAnimating) {
      animationRef.current = requestAnimationFrame(drawVisualization);
    }
  };

  const drawNetworkTraffic = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const time = Date.now() * 0.001;
    
    // Draw grid
    ctx.strokeStyle = '#00ffff20';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * width;
      const y = (i / 10) * height;
      
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw traffic waves
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10;

    for (let wave = 0; wave < 3; wave++) {
      ctx.beginPath();
      for (let x = 0; x < width; x += 2) {
        const frequency = 0.02 + wave * 0.01;
        const amplitude = 30 + wave * 20;
        const phase = time + wave * Math.PI / 3;
        const y = height / 2 + Math.sin(x * frequency + phase) * amplitude;
        
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.globalAlpha = 0.7 - wave * 0.2;
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  };

  const drawSystemMetrics = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const metrics = ['CPU', 'RAM', 'NET', 'DISK'];
    const values = [67, 84, 45, 78]; // Example values
    const time = Date.now() * 0.002;

    metrics.forEach((metric, index) => {
      const x = (index + 0.5) * (width / 4);
      const maxHeight = height - 60;
      const currentValue = values[index] + Math.sin(time + index) * 10;
      const barHeight = (currentValue / 100) * maxHeight;

      // Draw bar background
      ctx.fillStyle = '#00ff0020';
      ctx.fillRect(x - 30, height - maxHeight, 60, maxHeight);

      // Draw active bar
      ctx.fillStyle = '#00ff00';
      ctx.shadowColor = '#00ff00';
      ctx.shadowBlur = 15;
      ctx.fillRect(x - 30, height - barHeight, 60, barHeight);

      // Draw label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(metric, x, height - 10);
      ctx.fillText(`${Math.round(currentValue)}%`, x, height - 25);
    });

    ctx.shadowBlur = 0;
  };

  const drawThreatAnalysis = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const threats = [
      { x: 100, y: 80, level: 'HIGH', size: 8 },
      { x: 250, y: 150, level: 'MEDIUM', size: 6 },
      { x: 400, y: 200, level: 'LOW', size: 4 },
      { x: 150, y: 250, level: 'CRITICAL', size: 12 },
    ];

    const time = Date.now() * 0.003;

    threats.forEach((threat, index) => {
      const pulse = Math.sin(time + index) * 0.3 + 0.7;
      const color = threat.level === 'CRITICAL' ? '#ff0000' :
                   threat.level === 'HIGH' ? '#ff6600' :
                   threat.level === 'MEDIUM' ? '#ffff00' : '#00ff00';

      // Draw threat indicator
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 20;
      ctx.globalAlpha = pulse;
      
      ctx.beginPath();
      ctx.arc(threat.x, threat.y, threat.size * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Draw ripple effect
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(threat.x, threat.y, threat.size * 2 * pulse, 0, Math.PI * 2);
      ctx.stroke();

      // Draw label
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(threat.level, threat.x, threat.y + 20);
    });

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  };

  const drawMissionProgress = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const missions = [
      { name: 'ALPHA', progress: 75, color: '#00ff00' },
      { name: 'BETA', progress: 45, color: '#ffff00' },
      { name: 'GAMMA', progress: 90, color: '#ff6600' },
    ];

    missions.forEach((mission, index) => {
      const y = 50 + index * 80;
      const barWidth = width - 100;
      const progressWidth = (mission.progress / 100) * barWidth;

      // Draw background
      ctx.fillStyle = '#ffffff20';
      ctx.fillRect(50, y, barWidth, 20);

      // Draw progress
      ctx.fillStyle = mission.color;
      ctx.shadowColor = mission.color;
      ctx.shadowBlur = 10;
      ctx.fillRect(50, y, progressWidth, 20);

      // Draw label
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`${mission.name}: ${mission.progress}%`, 50, y - 5);
    });

    ctx.shadowBlur = 0;
  };

  const drawRealtimeChart = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (currentData.length < 2) return;

    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Draw axes
    ctx.strokeStyle = '#ffffff40';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw data line
    ctx.strokeStyle = getColorForType(type);
    ctx.lineWidth = 2;
    ctx.shadowColor = getColorForType(type);
    ctx.shadowBlur = 10;

    ctx.beginPath();
    currentData.forEach((point, index) => {
      const x = padding + (index / (currentData.length - 1)) * chartWidth;
      const y = height - padding - (point.value / 100) * chartHeight;
      
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw data points
    currentData.forEach((point, index) => {
      const x = padding + (index / (currentData.length - 1)) * chartWidth;
      const y = height - padding - (point.value / 100) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.shadowBlur = 0;
  };

  return (
    <div className="hud-panel p-4">
      <div className="border-b border-primary/30 pb-2 mb-4">
        <div className="flex items-center justify-between">
          <h3 className="hud-text font-bold tracking-widest">
            {title || type.toUpperCase().replace(/_/g, '_')}
          </h3>
          <div className="flex items-center space-x-2">
            {realTime && (
              <Badge className="bg-terminal-green/20 text-terminal-green border-terminal-green/30 status-active">
                LIVE
              </Badge>
            )}
            <Badge className="bg-primary/20 text-primary border-primary/30">
              {type.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      <div className="relative" style={{ height }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full network-grid"
          style={{
            background: 'linear-gradient(45deg, transparent 0%, #00ffff05 50%, transparent 100%)'
          }}
        />
      </div>

      <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground">
        <span>Data points: {currentData.length}</span>
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="tactical-button px-2 py-1 text-xs"
        >
          {isAnimating ? 'PAUSE' : 'RESUME'}
        </button>
      </div>
    </div>
  );
};

export default DataVisualization;