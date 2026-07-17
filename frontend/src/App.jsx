import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import TaskBoard from './components/TaskBoard';

const THEMES = {
  purple: { '--accent-primary': '#8b5cf6', '--accent-hover': '#7c3aed' },
  emerald: { '--accent-primary': '#10b981', '--accent-hover': '#059669' },
  rose: { '--accent-primary': '#f43f5e', '--accent-hover': '#e11d48' },
  blue: { '--accent-primary': '#3b82f6', '--accent-hover': '#2563eb' }
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState('purple');
  const [colorMode, setColorMode] = useState(() => localStorage.getItem('colorMode') || 'system');

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const themeProps = THEMES[currentTheme];
    for (const key in themeProps) {
      document.documentElement.style.setProperty(key, themeProps[key]);
    }
  }, [currentTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const applyTheme = () => {
      let isDark = true;
      if (colorMode === 'light') isDark = false;
      else if (colorMode === 'dark') isDark = true;
      else if (colorMode === 'system') {
        isDark = mediaQuery.matches;
      }
      
      if (isDark) {
        document.body.classList.remove('light-theme');
      } else {
        document.body.classList.add('light-theme');
      }
      localStorage.setItem('colorMode', colorMode);
    };
    
    applyTheme();
    
    const listener = () => {
      if (colorMode === 'system') applyTheme();
    };
    
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [colorMode]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
      toast.error('Could not load tasks from server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Toaster position="top-right" toastOptions={{
        style: {
          background: 'var(--bg-card)',
          color: 'var(--text-main)',
          border: '1px solid var(--border-glass)',
          backdropFilter: 'blur(12px)'
        }
      }} />
      <header style={{ position: 'relative' }}>
        <div className="theme-switcher">
          <select 
            className="color-mode-select" 
            value={colorMode} 
            onChange={(e) => setColorMode(e.target.value)}
          >
            <option value="system" style={{color:'black'}}>Auto</option>
            <option value="dark" style={{color:'black'}}>Dark</option>
            <option value="light" style={{color:'black'}}>Light</option>
          </select>
          {Object.keys(THEMES).map(t => (
            <button 
              key={t}
              onClick={() => setCurrentTheme(t)}
              style={{
                width: '24px', height: '24px', borderRadius: '50%',
                backgroundColor: THEMES[t]['--accent-primary'],
                border: currentTheme === t ? '2px solid var(--text-main)' : 'none',
                cursor: 'pointer'
              }}
              title={`Switch to ${t} theme`}
            />
          ))}
        </div>
        <h1>Task Master</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your workflow with style.</p>
      </header>
      <main>
        {loading ? (
          <div className="loader">
            <div className="spinner"></div>
            <p>Loading tasks...</p>
          </div>
        ) : (
          <TaskBoard tasks={tasks} fetchTasks={fetchTasks} setTasks={setTasks} />
        )}
      </main>
    </div>
  );
}

export default App;
