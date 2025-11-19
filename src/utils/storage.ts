export interface SavedConfig {
  name: string;
  config: string;
}

const COOKIE_NAME = 'tea_timer_configs';

export const getSavedConfigs = (): SavedConfig[] => {
  const match = document.cookie.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)'));
  if (match) {
    try {
      return JSON.parse(decodeURIComponent(match[2]));
    } catch (e) {
      console.error('Failed to parse saved configs', e);
      return [];
    }
  }
  return [];
};

export const saveConfig = (name: string, config: string): SavedConfig[] => {
  const configs = getSavedConfigs();
  // Check if exists, update if so, else add
  const existingIndex = configs.findIndex((c) => c.name === name);
  if (existingIndex >= 0) {
    configs[existingIndex] = { name, config };
  } else {
    configs.push({ name, config });
  }
  
  saveToCookie(configs);
  return configs;
};

export const deleteConfig = (name: string): SavedConfig[] => {
  const configs = getSavedConfigs();
  const newConfigs = configs.filter((c) => c.name !== name);
  saveToCookie(newConfigs);
  return newConfigs;
};

export const updateConfig = (oldName: string, newName: string, newConfig: string): SavedConfig[] => {
  const configs = getSavedConfigs();
  const index = configs.findIndex((c) => c.name === oldName);
  
  if (index !== -1) {
    // If renaming, check if new name already exists (and isn't the same config)
    if (oldName !== newName) {
      const conflictIndex = configs.findIndex((c) => c.name === newName);
      if (conflictIndex !== -1) {
        // Overwrite existing if name conflict, or handle error?
        // For simplicity, we'll remove the conflicting one first
        configs.splice(conflictIndex, 1);
        // Re-find index since splice might have shifted it
        const newIndex = configs.findIndex((c) => c.name === oldName);
        if (newIndex !== -1) configs[newIndex] = { name: newName, config: newConfig };
      } else {
        configs[index] = { name: newName, config: newConfig };
      }
    } else {
      configs[index] = { name: newName, config: newConfig };
    }
    saveToCookie(configs);
  }
  return configs;
};

const saveToCookie = (configs: SavedConfig[]) => {
  const value = encodeURIComponent(JSON.stringify(configs));
  // Expires in 1 year
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  document.cookie = `${COOKIE_NAME}=${value}; path=/; expires=${date.toUTCString()}`;
};
