import { useEffect, useState } from 'react';

interface StatusRingProps {
  value: number;
  label: string;
  color?: 'primary' | 'orange' | 'red' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
}

const StatusRing = ({ value, label, color = 'primary', size = 'md' }: StatusRingProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };
  
  const colorClasses = {
    primary: 'stroke-primary',
    orange: 'stroke-tactical-orange',
    red: 'stroke-tactical-red',
    cyan: 'stroke-tactical-cyan'
  };
  
  const circumference = 2 * Math.PI * 40;
  const strokeDasharray = `${(animatedValue / 100) * circumference} ${circumference}`;
  
  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx="50%"
          cy="50%"
          r="40"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-muted-foreground/30"
        />
        <circle
          cx="50%"
          cy="50%"
          r="40"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          className={`${colorClasses[color]} transition-all duration-1000 ease-out`}
          style={{
            filter: `drop-shadow(0 0 4px hsl(var(--${color === 'primary' ? 'terminal-green' : `tactical-${color}`}) / 0.6))`
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-lg font-bold ${color === 'primary' ? 'text-primary' : `text-tactical-${color}`}`}>
          {Math.round(animatedValue)}%
        </span>
        <span className="text-xs text-muted-foreground tracking-wide">{label}</span>
      </div>
    </div>
  );
};

export default StatusRing;