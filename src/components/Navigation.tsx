import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useTheme } from './ThemeProvider';

const Navigation = () => {
  const location = useLocation();
  const { theme, glitchMode } = useTheme();
  const [agentStatus] = useState('ACTIVE');
  
  const navItems = [
    { path: '/', label: 'TACTICAL_HUB', icon: '◉' },
    { path: '/dashboard', label: 'CLASSIC_HUD', icon: '▣' },
    { path: '/missions', label: 'MISSIONS', icon: '▲' },
    { path: '/tactical', label: 'TACTICAL_CENTER', icon: '◈' },
    { path: '/profile', label: 'AGENT', icon: '●' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 hud-panel border-b ${glitchMode ? 'glitch' : ''}`}>
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="status-ring w-3 h-3"></div>
            <span className={`hud-text text-lg font-bold tracking-widest ${glitchMode ? 'glitch' : ''}`} data-text="ECHOCOMM_OS">
              ECHOCOMM_OS
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-1 rounded transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-primary/20 text-primary border border-primary/30 tactical-button'
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                }`}
              >
                <span className="terminal-text text-lg">{item.icon}</span>
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

          <Badge variant="outline" className={`tactical-button ${glitchMode ? 'glitch' : ''}`}>
            <span className="ml-1 terminal-text">{theme.toUpperCase()}</span>
          </Badge>
          
          <div className="hud-text text-xs">
            <span className="text-muted-foreground">SYS:</span>
            <span className="ml-1">{new Date().toLocaleTimeString('en-US', { hour12: false })}</span>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-primary/30 p-2">
        <div className="flex overflow-x-auto space-x-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-shrink-0 flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                location.pathname === item.path
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;