import { useState } from 'react';
import { UploadArea } from './components/UploadArea';
import { ProcessingScreen } from './components/ProcessingScreen';
import { ResultScreen } from './components/ResultScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { Shield, History, Settings, LogOut } from 'lucide-react';

function App() {
  const [appState, setAppState] = useState<'upload' | 'analyzing' | 'results'>('upload');
  const [activeTab, setActiveTab] = useState<'analyzer' | 'history' | 'settings'>('analyzer');
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('deepshield_history');
    return saved ? JSON.parse(saved) : [];
  });

  const saveToHistory = (newResult: any) => {
    // Check if saving is enabled in settings
    const savedSettings = localStorage.getItem('deepshield_settings');
    const settings = savedSettings ? JSON.parse(savedSettings) : { saveHistory: true };
    if (!settings.saveHistory) return;

    const item = { ...newResult, timestamp: Date.now() };
    const newHistory = [item, ...analysisHistory];
    setAnalysisHistory(newHistory);
    localStorage.setItem('deepshield_history', JSON.stringify(newHistory));
  };

  const handleClearHistory = () => {
    setAnalysisHistory([]);
    localStorage.removeItem('deepshield_history');
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentTask(data.task_id);
        setAppState('analyzing');
      } else {
        alert('Upload failed. Please check the backend server.');
      }
    } catch (error) {
      console.error(error);
      alert('Upload failed. Is the backend running?');
    } finally {
      setIsUploading(false);
    }
  };

  const resetApp = () => {
    setCurrentTask(null);
    setResult(null);
    setAppState('upload');
    setActiveTab('analyzer');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '260px', 
        borderRight: '1px solid var(--border-color)', 
        background: 'rgba(28,28,30,0.5)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={resetApp}>
          <div style={{ padding: '0.5rem', background: 'rgba(214,194,161,0.1)', borderRadius: '10px', color: 'var(--primary-beige)' }}>
            <Shield size={24} />
          </div>
          <span className="text-gradient" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>DeepShield</span>
        </div>

        <nav style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button onClick={() => setActiveTab('analyzer')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: activeTab === 'analyzer' ? 'rgba(214,194,161,0.1)' : 'transparent', color: activeTab === 'analyzer' ? 'var(--primary-beige)' : 'var(--text-secondary)', borderRadius: '12px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === 'analyzer' ? 600 : 400 }}>
            <Shield size={20} />
            Analyzer
          </button>
          <button onClick={() => setActiveTab('history')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: activeTab === 'history' ? 'rgba(214,194,161,0.1)' : 'transparent', color: activeTab === 'history' ? 'var(--primary-beige)' : 'var(--text-secondary)', borderRadius: '12px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === 'history' ? 600 : 400 }}>
            <History size={20} />
            History
          </button>
          <button onClick={() => setActiveTab('settings')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: activeTab === 'settings' ? 'rgba(214,194,161,0.1)' : 'transparent', color: activeTab === 'settings' ? 'var(--primary-beige)' : 'var(--text-secondary)', borderRadius: '12px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === 'settings' ? 600 : 400 }}>
            <Settings size={20} />
            Settings
          </button>
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', width: '100%', background: 'transparent', color: 'var(--text-secondary)', borderRadius: '12px', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflowY: 'auto' }}>
        <div style={{ flex: 1, padding: '3rem', display: 'flex', flexDirection: 'column' }}>
          
          {activeTab === 'analyzer' && (
            <>
              {appState === 'upload' && (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UploadArea onUpload={handleUpload} isUploading={isUploading} />
                </div>
              )}

              {appState === 'analyzing' && currentTask && (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ProcessingScreen 
                    taskId={currentTask} 
                    onComplete={(res) => {
                      setResult(res);
                      saveToHistory(res);
                      setAppState('results');
                    }} 
                  />
                </div>
              )}

              {appState === 'results' && result && (
                <ResultScreen result={result} onReset={resetApp} />
              )}
            </>
          )}

          {activeTab === 'history' && (
            <HistoryScreen 
              history={analysisHistory} 
              onSelect={(item) => {
                setResult(item);
                setCurrentTask(item.task_id);
                setAppState('results');
                setActiveTab('analyzer');
              }} 
            />
          )}

          {activeTab === 'settings' && (
            <SettingsScreen onClearHistory={handleClearHistory} />
          )}

        </div>
      </main>

      {/* Decorative Background Elements */}
      <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '40vw', height: '40vw', background: 'rgba(214,194,161,0.03)', filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none', zIndex: -1 }} />
      <div style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '40vw', height: '40vw', background: 'rgba(139,107,74,0.05)', filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none', zIndex: -1 }} />
    </div>
  );
}

export default App;
