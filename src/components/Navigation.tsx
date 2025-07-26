import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const Navigation = () => {
  const location = useLocation();
  const [agentStatus] = useState('ACTIVE');
  
  const navItems = [
    { path: '/', label: 'HUD', icon: '◉' },
    { path: '/missions', label: 'MISSIONS', icon: '▣' },
    { path: '/profile', label: 'AGENT', icon: '◈' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 hud-panel border-b">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="status-ring w-3 h-3"></div>
            <span className="hud-text text-lg font-bold tracking-widest">ECHOCOMM_OS</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-1 rounded transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <span className="terminal-text">{item.icon}</span>
                <span className="terminal-text text-xs">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="tactical-button">
            <span className="status-active">●</span>
            <span className="ml-1 terminal-text">{agentStatus}</span>
          </Badge>
          
          <div className="hud-text text-xs">
            <span className="text-muted-foreground">SYS:</span>
            <span className="ml-1">{new Date().toLocaleTimeString('en-US', { hour12: false })}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;