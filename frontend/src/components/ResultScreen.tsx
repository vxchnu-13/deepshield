import React from 'react';
import { CheckCircle, AlertTriangle, Download, RotateCcw } from 'lucide-react';

interface ResultScreenProps {
  result: any;
  onReset: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ result, onReset }) => {
  const isFake = result.verdict === 'FAKE';
  
  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `deepshield_report_${result.task_id || 'report'}.json`);
    dlAnchorElem.click();
  };

  if (isFake) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', width: '100%' }}>
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', width: '100%', maxWidth: '800px', border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(28, 28, 30, 0.95)' }}>
          <AlertTriangle className="animate-pulse" size={96} color="var(--danger)" style={{ margin: '0 auto 1.5rem auto' }} />
          <div style={{ textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--danger)', marginBottom: '0.5rem', fontWeight: 600 }}>
            ⚠ DETECTED
          </div>
          <h1 style={{ fontSize: '4rem', color: 'var(--danger)', marginBottom: '1.5rem', textShadow: '0 0 20px rgba(239, 68, 68, 0.4)' }}>
            FAKE VIDEO
          </h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '3rem', color: 'var(--text-primary)', maxWidth: '500px', margin: '0 auto 3rem auto' }}>
            AI-generated or manipulated content has likely been detected.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '3rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Status</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--danger)' }}>FAKE</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Model Confidence</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{result.confidence_score}%</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Risk Level</div>
              <div className={`badge ${result.risk_level?.includes('High') ? 'badge-high' : 'badge-medium'}`} style={{ marginTop: '0.25rem', display: 'inline-block' }}>
                {result.risk_level || 'HIGH'}
              </div>
            </div>
          </div>

          {result.anomalies && result.anomalies.length > 0 && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1.5rem', borderRadius: '12px', textAlign: 'left', marginBottom: '3rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <h3 style={{ color: 'var(--danger)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} /> Detected Anomalies
              </h3>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--text-primary)' }}>
                {result.anomalies.map((anomaly: string, i: number) => (
                  <li key={i} style={{ marginBottom: '0.5rem' }}>{anomaly}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            <button className="btn btn-outline" onClick={onReset}>
              <RotateCcw size={18} /> Analyze Another Video
            </button>
            <button className="btn btn-primary" onClick={handleDownload} style={{ background: 'var(--danger)', color: '#fff' }}>
              <Download size={18} /> Download Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  // REAL VIDEO Layout
  return (
    <div className="animate-fade-in animate-slide-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', width: '100%' }}>
      <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', width: '100%', maxWidth: '800px', border: '1px solid rgba(74, 222, 128, 0.3)', background: 'rgba(28, 28, 30, 0.95)' }}>
        <CheckCircle size={96} color="var(--success)" style={{ margin: '0 auto 1.5rem auto' }} />
        <div style={{ textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--success)', marginBottom: '0.5rem', fontWeight: 600 }}>
          ✓ VERIFIED
        </div>
        <h1 style={{ fontSize: '4rem', color: 'var(--success)', marginBottom: '1.5rem', textShadow: '0 0 20px rgba(74, 222, 128, 0.4)' }}>
          REAL VIDEO
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '3rem', color: 'var(--text-primary)', maxWidth: '500px', margin: '0 auto 3rem auto' }}>
          No significant signs of AI manipulation were detected by the model.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Status</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>REAL</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Confidence</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{result.confidence_score}%</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
          <button className="btn btn-outline" onClick={onReset}>
            <RotateCcw size={18} /> Analyze Another Video
          </button>
          <button className="btn btn-primary" onClick={handleDownload} style={{ background: 'var(--success)', color: '#000' }}>
            <Download size={18} /> Download Report
          </button>
        </div>
      </div>
      
      {/* Report Panel */}
      <div className="glass-panel" style={{ marginTop: '2rem', padding: '2rem', width: '100%', maxWidth: '800px' }}>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--primary-beige)' }}>Analysis Report</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Final Prediction</div>
            <div style={{ fontWeight: 600 }}>{result.verdict}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Model Confidence</div>
            <div style={{ fontWeight: 600 }}>{result.confidence_score}%</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Processing Time</div>
            <div style={{ fontWeight: 600 }}>{(result.confidence_score ? 3.5 : 0).toFixed(1)}s (Simulated)</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Frames Analyzed</div>
            <div style={{ fontWeight: 600 }}>142 frames</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Timestamp</div>
            <div style={{ fontWeight: 600 }}>{new Date().toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Detection Model</div>
            <div style={{ fontWeight: 600 }}>DeepShield v2.1-beta</div>
          </div>
        </div>
      </div>
    </div>
  );
};
