import React from 'react';
import { History, Play, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface HistoryItem {
  task_id: string;
  verdict: string;
  confidence_score: number;
  risk_level: string;
  timestamp: number;
}

interface HistoryScreenProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, onSelect }) => {
  if (history.length === 0) {
    return (
      <div className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <History size={64} color="var(--border-color)" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '2rem', color: 'var(--text-secondary)' }}>No History Yet</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Analyze a video to see it here.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <History size={32} color="var(--primary-beige)" />
        <h2 style={{ fontSize: '2rem', m: 0 }}>Analysis History</h2>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {history.map((item, index) => {
          const isFake = item.verdict === 'FAKE';
          return (
            <div 
              key={item.task_id || index}
              className="glass-panel"
              onClick={() => onSelect(item)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '1.5rem', 
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderLeft: `4px solid ${isFake ? 'var(--danger)' : 'var(--success)'}`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.3)';
              }}
            >
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '50%' }}>
                  <Play size={24} color="var(--text-secondary)" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Task #{item.task_id?.substring(0,8) || 'Unknown'}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} /> {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: isFake ? 'var(--danger)' : 'var(--success)' }}>
                      {isFake ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
                      {item.verdict}
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>• Confidence: {item.confidence_score}%</span>
                    {isFake && <span style={{ color: 'var(--text-secondary)' }}>• Risk: {item.risk_level}</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
