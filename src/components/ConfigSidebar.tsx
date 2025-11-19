import React, { useState, useEffect } from 'react';
import { getSavedConfigs, deleteConfig, updateConfig, type SavedConfig } from '../utils/storage';

interface ConfigSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onLoad: (config: string, name?: string) => void;
  refreshTrigger: number; // Simple way to trigger re-render when new config is saved
}

export const ConfigSidebar: React.FC<ConfigSidebarProps> = ({ isOpen, onToggle, onLoad, refreshTrigger }) => {
  const [configs, setConfigs] = useState<SavedConfig[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editConfig, setEditConfig] = useState('');

  useEffect(() => {
    setConfigs(getSavedConfigs());
  }, [refreshTrigger, isOpen]);

  const handleDelete = (name: string) => {
    if (confirm(`Delete configuration "${name}"?`)) {
      setConfigs(deleteConfig(name));
    }
  };

  const handleEdit = (config: SavedConfig) => {
    setEditingId(config.name);
    setEditName(config.name);
    setEditConfig(config.config);
  };

  const handleSaveEdit = (oldName: string) => {
    if (editName && editConfig) {
      setConfigs(updateConfig(oldName, editName, editConfig));
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="sidebar-toggle" onClick={onToggle}>
        {isOpen ? '>' : '<'}
      </button>
      
      <div className="sidebar-content">
        <h2>Saved Configs</h2>
        {configs.length === 0 ? (
          <p style={{ opacity: 0.5 }}>No saved configurations.</p>
        ) : (
          <div className="config-list">
            {configs.map((c) => (
              <div key={c.name} className="config-item">
                {editingId === c.name ? (
                  <div className="edit-mode">
                    <input 
                      type="text" 
                      value={editName} 
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Name"
                      className="edit-input"
                    />
                    <input 
                      type="text" 
                      value={editConfig} 
                      onChange={(e) => setEditConfig(e.target.value)}
                      placeholder="Config"
                      className="edit-input"
                    />
                    <div className="edit-actions">
                      <button onClick={() => handleSaveEdit(c.name)} className="save-btn">Save</button>
                      <button onClick={handleCancelEdit} className="cancel-btn">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="config-header">
                      <strong>{c.name}</strong>
                      <div>
                        <button 
                          className="edit-btn"
                          onClick={() => handleEdit(c)}
                          title="Edit"
                        >
                          ✎
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDelete(c.name)}
                          title="Delete"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    <div className="config-preview">{c.config}</div>
                    <button 
                      className="load-btn"
                      onClick={() => onLoad(c.config, c.name)}
                    >
                      Load
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
