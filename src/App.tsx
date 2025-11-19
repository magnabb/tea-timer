import { useState, useMemo, useCallback, useEffect } from 'react';
import { ConfigInput } from './components/ConfigInput';
import { TeaTimer } from './components/TeaTimer';
import { ConfigSidebar } from './components/ConfigSidebar';
import { parseConfig } from './utils/parser';
import { saveConfig } from './utils/storage';
import './index.css';

function App() {
  const [configStr, setConfigStr] = useState('(3-5 -> 5-7) -> 10 -> 10-12 -> 15 -> 20 -> 25-30 -> 35-40 -> 50-60 -> 70-80 -> 90-100 -> 120-180');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentConfigName, setCurrentConfigName] = useState<string | null>(null);
  
  const [error, setError] = useState<string | null>(null);

  // Update document title when config name changes
  useEffect(() => {
    if (currentConfigName) {
      document.title = `${currentConfigName} | Tea Timer`;
    } else {
      document.title = 'Tea Timer';
    }
  }, [currentConfigName]);
  
  const stages = useMemo(() => {
    try {
      const result = parseConfig(configStr);
      if (result.length === 0 && configStr.trim().length > 0) {
        throw new Error('Empty configuration');
      }
      setError(null);
      return result;
    } catch {
      setError('Incorrect configuration, please follow guidelines');
      return [];
    }
  }, [configStr]);

  const handleSave = useCallback((name: string, config: string) => {
    saveConfig(name, config);
    setRefreshTrigger(prev => prev + 1);
    setIsSidebarOpen(true); // Open sidebar to show saved config
    setCurrentConfigName(name);
  }, []);

  const handleLoad = useCallback((config: string, name?: string) => {
    setConfigStr(config);
    setCurrentConfigName(name || null);
  }, []);

  const handleResetTitle = useCallback(() => {
    setCurrentConfigName(null);
  }, []);

  return (
    <div className="app">
      <a 
        href="https://github.com/magnabb/tea-timer" 
        target="_blank" 
        rel="noopener noreferrer"
        className="github-link"
        aria-label="View source on GitHub"
      >
        <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
      </a>

      <ConfigSidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        onLoad={handleLoad}
        refreshTrigger={refreshTrigger}
      />

      <h1>Tea Timer{currentConfigName && ` - ${currentConfigName}`}</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <ConfigInput 
          initialConfig={configStr} 
          onConfigChange={setConfigStr} 
          onSave={handleSave}
        />
      </div>

      <TeaTimer stages={stages} error={error} onResetTitle={handleResetTitle} />
    </div>
  );
}

export default App;
