import React, { useState, useEffect } from 'react';
import { Settings, Save, Trash2, Shield, Bell } from 'lucide-react';

export interface AppSettings {
  saveHistory: boolean;
  autoDownload: boolean;
  soundAlerts: boolean;
}

const defaultSettings: AppSettings = {
  saveHistory: true,
  autoDownload: false,
  soundAlerts: true,
};

interface SettingsScreenProps {
  onClearHistory: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onClearHistory }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('deepshield_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    localStorage.setItem('deepshield_settings', JSON.stringify(settings));
    setSavedMessage(true);
    const timer = setTimeout(() => setSavedMessage(false), 2000);
    return () => clearTimeout(timer);
  }, [settings]);

  const toggleSetting = (key: keyof AppSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all analysis history? This cannot be undone.")) {
      onClearHistory();
      alert("History cleared successfully.");
    }
  };

  return (
    <div className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Settings size={32} color="var(--primary-beige)" />
        <h2 style={{ fontSize: '2rem', m: 0 }}>Preferences</h2>
      </div>

      <div style={{ display: 'grid', gap: '2rem', maxWidth: '600px' }}>
        
        {/* Privacy & Data */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary-beige)', fontSize: '1.2rem' }}>
            <Shield size={20} /> Data & Privacy
          </h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Save History Locally</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Store past analysis results in your browser's local storage.</div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={settings.saveHistory} 
                onChange={() => toggleSetting('saveHistory')}
                style={{ width: '20px', height: '20px', accentColor: 'var(--accent-brown)' }} 
              />
            </label>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Clear All History</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Permanently delete all stored analysis data.</div>
            </div>
            <button className="btn btn-outline" onClick={handleClearHistory} style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '0.5rem 1rem' }}>
              <Trash2 size={18} /> Clear Data
            </button>
          </div>
        </div>

        {/* General Settings */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary-beige)', fontSize: '1.2rem' }}>
            <Settings size={20} /> General Functionality
          </h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Auto-Download Reports</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Automatically trigger PDF/JSON download when analysis finishes.</div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={settings.autoDownload} 
                onChange={() => toggleSetting('autoDownload')}
                style={{ width: '20px', height: '20px', accentColor: 'var(--accent-brown)' }} 
              />
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Sound Alerts</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Play a sound when fake video is detected.</div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={settings.soundAlerts} 
                onChange={() => toggleSetting('soundAlerts')}
                style={{ width: '20px', height: '20px', accentColor: 'var(--accent-brown)' }} 
              />
            </label>
          </div>
        </div>
        
      </div>

      {savedMessage && (
        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', animation: 'fadeIn 0.3s ease' }}>
          <Save size={18} /> Settings saved automatically
        </div>
      )}

    </div>
  );
};
