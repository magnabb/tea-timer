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

  return (
    <div className="app">
      <ConfigSidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        onLoad={handleLoad}
        refreshTrigger={refreshTrigger}
      />

      <h1>Tea Timer</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <ConfigInput 
          initialConfig={configStr} 
          onConfigChange={setConfigStr} 
          onSave={handleSave}
        />
      </div>

      <TeaTimer stages={stages} error={error} />
    </div>
  );
}

export default App;
