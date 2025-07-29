import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  themes: ThemeConfig[];
  particles: boolean;
  setParticles: (enabled: boolean) => void;
  animations: boolean;
  setAnimations: (enabled: boolean) => void;
  glitchMode: boolean;
  setGlitchMode: (enabled: boolean) => void;
}

interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    terminal: string;
    cyber: string;
  };
  effects: {
    glow: boolean;
    particles: boolean;
    matrix: boolean;
    scanLines: boolean;
  };
}

const defaultThemes: ThemeConfig[] = [
  {
    id: 'tactical',
    name: 'TACTICAL_STANDARD',
    description: 'Standard military-grade interface',
    colors: {
      primary: '120 100% 50%',
      secondary: '210 15% 15%',
      accent: '180 100% 50%',
      terminal: '120 100% 50%',
      cyber: '180 100% 50%',
    },
    effects: {
      glow: true,
      particles: true,
      matrix: true,
      scanLines: true,
    },
  },
  {
    id: 'stealth',
    name: 'STEALTH_OPS',
    description: 'Low-visibility covert operations mode',
    colors: {
      primary: '240 100% 40%',
      secondary: '210 15% 8%',
      accent: '270 100% 60%',
      terminal: '240 100% 40%',
      cyber: '270 100% 60%',
    },
    effects: {
      glow: false,
      particles: false,
      matrix: false,
      scanLines: true,
    },
  },
  {
    id: 'combat',
    name: 'COMBAT_READY',
    description: 'High-intensity combat interface',
    colors: {
      primary: '0 100% 60%',
      secondary: '210 15% 20%',
      accent: '30 100% 60%',
      terminal: '0 100% 60%',
      cyber: '30 100% 60%',
    },
    effects: {
      glow: true,
      particles: true,
      matrix: false,
      scanLines: true,
    },
  },
  {
    id: 'recon',
    name: 'RECON_MODE',
    description: 'Enhanced surveillance and data analysis',
    colors: {
      primary: '180 100% 50%',
      secondary: '210 15% 12%',
      accent: '120 100% 50%',
      terminal: '180 100% 50%',
      cyber: '120 100% 50%',
    },
    effects: {
      glow: true,
      particles: true,
      matrix: true,
      scanLines: false,
    },
  },
  {
    id: 'cyber',
    name: 'CYBER_WARFARE',
    description: 'Digital infiltration and hacking interface',
    colors: {
      primary: '320 100% 60%',
      secondary: '210 15% 6%',
      accent: '270 100% 60%',
      terminal: '320 100% 60%',
      cyber: '270 100% 60%',
    },
    effects: {
      glow: true,
      particles: true,
      matrix: true,
      scanLines: true,
    },
  },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState('tactical');
  const [particles, setParticles] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [glitchMode, setGlitchMode] = useState(false);

  const currentTheme = defaultThemes.find(t => t.id === theme) || defaultThemes[0];

  useEffect(() => {
    const root = document.documentElement;
    const themeConfig = currentTheme;

    // Apply theme colors
    root.style.setProperty('--primary', themeConfig.colors.primary);
    root.style.setProperty('--terminal-green', themeConfig.colors.terminal);
    root.style.setProperty('--cyber-cyan', themeConfig.colors.cyber);
    root.style.setProperty('--accent', themeConfig.colors.accent);

    // Apply theme effects
    root.classList.toggle('no-particles', !particles || !themeConfig.effects.particles);
    root.classList.toggle('no-animations', !animations);
    root.classList.toggle('glitch-mode', glitchMode);
    root.classList.toggle('no-matrix', !themeConfig.effects.matrix);
    root.classList.toggle('no-scan-lines', !themeConfig.effects.scanLines);
    root.classList.toggle('no-glow', !themeConfig.effects.glow);
  }, [theme, particles, animations, glitchMode, currentTheme]);

  useEffect(() => {
    // Create particle system
    if (particles && currentTheme.effects.particles) {
      createParticleSystem();
    }
  }, [particles, currentTheme.effects.particles]);

  const createParticleSystem = () => {
    const existingContainer = document.querySelector('.particle-container');
    if (existingContainer) {
      existingContainer.remove();
    }

    const container = document.createElement('div');
    container.className = 'particle-container';
    document.body.appendChild(container);

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 10 + 's';
      particle.style.animationDuration = (Math.random() * 5 + 5) + 's';
      container.appendChild(particle);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        themes: defaultThemes,
        particles,
        setParticles,
        animations,
        setAnimations,
        glitchMode,
        setGlitchMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};