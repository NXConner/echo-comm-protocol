import React, { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';

interface HologramDisplayProps {
  title?: string;
  model?: 'cube' | 'sphere' | 'pyramid' | 'network' | 'data_matrix';
  size?: 'sm' | 'md' | 'lg';
  rotation?: boolean;
  glitch?: boolean;
  data?: any[];
}

const HologramDisplay: React.FC<HologramDisplayProps> = ({
  title = "HOLOGRAM_DISPLAY",
  model = 'cube',
  size = 'md',
  rotation = true,
  glitch = false,
  data = []
}) => {
  const [isActive, setIsActive] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sizeClasses = {
    sm: 'w-48 h-48',
    md: 'w-64 h-64',
    lg: 'w-80 h-80'
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 300;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set hologram glow effect
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 20;
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.8;

      const time = Date.now() * 0.001;
      const rotationAngle = rotation ? time : 0;

      switch (model) {
        case 'cube':
          drawRotatingCube(ctx, centerX, centerY, rotationAngle);
          break;
        case 'sphere':
          drawRotatingSphere(ctx, centerX, centerY, rotationAngle);
          break;
        case 'pyramid':
          drawRotatingPyramid(ctx, centerX, centerY, rotationAngle);
          break;
        case 'network':
          drawNetworkVisualization(ctx, centerX, centerY, time);
          break;
        case 'data_matrix':
          drawDataMatrix(ctx, centerX, centerY, time, data);
          break;
      }

      // Add scan lines
      drawScanLines(ctx, canvas.width, canvas.height, time);

      // Add glitch effect
      if (glitch && Math.random() < 0.1) {
        ctx.globalAlpha = Math.random() * 0.5 + 0.5;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(0, Math.random() * canvas.height, canvas.width, 2);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(0, Math.random() * canvas.height, canvas.width, 1);
      }

      if (isActive) {
        requestAnimationFrame(animate);
      }
    };

    animate();

    return () => setIsActive(false);
  }, [model, rotation, glitch, data, isActive]);

  const drawRotatingCube = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, angle: number) => {
    const size = 60;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    // Define cube vertices
    const vertices = [
      [-size, -size, -size], [size, -size, -size], [size, size, -size], [-size, size, -size],
      [-size, -size, size], [size, -size, size], [size, size, size], [-size, size, size]
    ];

    // Rotate and project vertices
    const projected = vertices.map(([x, y, z]) => {
      const rotatedX = x * cos - z * sin;
      const rotatedZ = x * sin + z * cos;
      return [
        centerX + rotatedX,
        centerY + y,
        rotatedZ
      ];
    });

    // Draw cube edges
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // back face
      [4, 5], [5, 6], [6, 7], [7, 4], // front face
      [0, 4], [1, 5], [2, 6], [3, 7]  // connecting edges
    ];

    edges.forEach(([start, end]) => {
      ctx.beginPath();
      ctx.moveTo(projected[start][0], projected[start][1]);
      ctx.lineTo(projected[end][0], projected[end][1]);
      ctx.stroke();
    });
  };

  const drawRotatingSphere = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, angle: number) => {
    const radius = 80;
    
    // Draw main sphere outline
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw rotating meridians
    for (let i = 0; i < 12; i++) {
      const meridianAngle = (i * Math.PI / 6) + angle;
      ctx.beginPath();
      
      for (let j = 0; j <= 50; j++) {
        const lat = (j / 50) * Math.PI - Math.PI / 2;
        const x = centerX + radius * Math.cos(lat) * Math.cos(meridianAngle);
        const y = centerY + radius * Math.sin(lat);
        
        if (j === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    // Draw latitude lines
    for (let i = 1; i < 6; i++) {
      const lat = (i / 6) * Math.PI - Math.PI / 2;
      const circleRadius = radius * Math.cos(lat);
      const circleY = centerY + radius * Math.sin(lat);
      
      ctx.beginPath();
      ctx.arc(centerX, circleY, circleRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const drawRotatingPyramid = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, angle: number) => {
    const size = 80;
    const height = 100;
    
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    // Base vertices
    const base = [
      [-size, size, 0], [size, size, 0], [size, -size, 0], [-size, -size, 0]
    ];
    
    // Apex
    const apex = [0, 0, -height];

    // Rotate and project all points
    const projectPoint = ([x, y, z]: number[]) => {
      const rotatedX = x * cos - z * sin;
      const rotatedZ = x * sin + z * cos;
      return [centerX + rotatedX, centerY + y];
    };

    const projectedBase = base.map(projectPoint);
    const projectedApex = projectPoint(apex);

    // Draw base
    ctx.beginPath();
    projectedBase.forEach(([x, y], i) => {
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.stroke();

    // Draw edges to apex
    projectedBase.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(projectedApex[0], projectedApex[1]);
      ctx.stroke();
    });
  };

  const drawNetworkVisualization = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) => {
    const nodes = 12;
    const radius = 100;

    // Draw nodes
    const nodePositions: number[][] = [];
    for (let i = 0; i < nodes; i++) {
      const angle = (i / nodes) * Math.PI * 2 + time * 0.2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      nodePositions.push([x, y]);

      // Node circle
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Pulsing effect
      const pulse = Math.sin(time * 3 + i) * 0.5 + 0.5;
      ctx.globalAlpha = pulse;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.8;
    }

    // Draw connections
    nodePositions.forEach(([x1, y1], i) => {
      nodePositions.forEach(([x2, y2], j) => {
        if (i !== j && Math.random() < 0.3) {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.globalAlpha = 0.3;
          ctx.stroke();
          ctx.globalAlpha = 0.8;
        }
      });
    });

    // Central hub
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawDataMatrix = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number, data: any[]) => {
    const gridSize = 20;
    const cellSize = 10;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = centerX - (gridSize * cellSize) / 2 + i * cellSize;
        const y = centerY - (gridSize * cellSize) / 2 + j * cellSize;
        
        const intensity = Math.sin(time + i * 0.1 + j * 0.1) * 0.5 + 0.5;
        ctx.globalAlpha = intensity;
        
        ctx.beginPath();
        ctx.rect(x, y, cellSize - 1, cellSize - 1);
        ctx.stroke();
        
        if (Math.random() < 0.1) {
          ctx.fill();
        }
      }
    }
    ctx.globalAlpha = 0.8;
  };

  const drawScanLines = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const linePosition = (time * 50) % height;
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(0, linePosition, width, 2);
    ctx.globalAlpha = 0.8;
  };

  return (
    <div className="holographic p-4">
      <div className="border-b border-cyber-cyan/30 pb-2 mb-4">
        <div className="flex items-center justify-between">
          <h3 className="hud-text font-bold tracking-widest">{title}</h3>
          <div className="flex items-center space-x-2">
            <Badge className={`${isActive ? 'bg-terminal-green/20 text-terminal-green' : 'bg-muted/20 text-muted-foreground'} border-terminal-green/30`}>
              {isActive ? 'ACTIVE' : 'INACTIVE'}
            </Badge>
            {glitch && (
              <Badge className="bg-rogue-red/20 text-rogue-red border-rogue-red/30">
                GLITCH_MODE
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className={`${sizeClasses[size]} mx-auto relative`}>
        <canvas
          ref={canvasRef}
          className="w-full h-full transform-3d rotate-3d"
          style={{
            filter: 'drop-shadow(0 0 20px #00ffff40)',
            background: 'radial-gradient(circle, transparent 40%, #00ffff05 100%)'
          }}
        />
        
        {/* Hologram frame */}
        <div className="absolute inset-0 border border-cyber-cyan/30 rounded">
          <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyber-cyan"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyber-cyan"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyber-cyan"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyber-cyan"></div>
        </div>
      </div>

      <div className="mt-4 flex justify-center space-x-2">
        <button
          onClick={() => setIsActive(!isActive)}
          className="tactical-button px-3 py-1 text-xs"
        >
          {isActive ? 'DEACTIVATE' : 'ACTIVATE'}
        </button>
      </div>
    </div>
  );
};

export default HologramDisplay;