import { ReactNode } from 'react';

interface HUDPanelProps {
  title: string;
  children: ReactNode;
  className?: string;
  glitch?: boolean;
}

const HUDPanel = ({ title, children, className = '', glitch = false }: HUDPanelProps) => {
  return (
    <div className={`hud-panel p-4 ${glitch ? 'glitch' : ''} ${className}`}>
      <div className="border-b border-primary/30 pb-2 mb-4">
        <h3 className="hud-text font-bold tracking-widest">{title}</h3>
      </div>
      {children}
    </div>
  );
};

export default HUDPanel;