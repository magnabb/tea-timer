import React, { useState } from 'react';

interface ConfigInputProps {
  onConfigChange: (config: string) => void;
  initialConfig: string;
  onSave: (name: string, config: string) => void;
}

export const ConfigInput: React.FC<ConfigInputProps> = ({ onConfigChange, initialConfig, onSave }) => {
  const [value, setValue] = useState(initialConfig);
  const [error, setError] = useState<string | null>(null);

  // Update local state when prop changes (e.g. loaded from sidebar)
  React.useEffect(() => {
    setValue(initialConfig);
  }, [initialConfig]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    try {
      onConfigChange(newValue);
      setError(null);
    } catch (err) {
      setError('Invalid format');
    }
  };

  const handleSave = () => {
    const name = window.prompt('Enter configuration name (stored in cookies):');
    if (name) {
      onSave(name, value);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <label style={{ display: 'block', margin: 0 }}>
          Timer Configuration (e.g., 25-30 -&gt; 60)
        </label>
        <button 
          onClick={handleSave}
          className="save-config-btn"
        >
          Save
        </button>
      </div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="(3-5 -> 5-7) -> 10 -> 10-12..."
      />
      {error && <div style={{ color: 'red', marginTop: '0.5rem' }}>{error}</div>}
    </div>
  );
};
