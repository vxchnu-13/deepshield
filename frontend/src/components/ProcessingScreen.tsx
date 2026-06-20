import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface ProcessingScreenProps {
  taskId: string;
  onComplete: (result: any) => void;
}

const steps = [
  "Extracting frames",
  "Detecting facial regions",
  "Computing temporal features",
  "Running AI inference",
  "Finalizing prediction"
];

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ taskId, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Initializing analysis...');

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const checkStatus = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/status/${taskId}`);
        if (response.ok) {
          const data = await response.json();
          setProgress(data.progress);
          setMessage(data.message);

          if (data.status === 'completed') {
            clearInterval(intervalId);
            fetchResult();
          }
        }
      } catch (err) {
        console.error("Error fetching status", err);
      }
    };

    const fetchResult = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/results/${taskId}`);
        if (response.ok) {
          const data = await response.json();
          setTimeout(() => onComplete(data), 1000); // Small delay for UI smoothness
        }
      } catch (err) {
        console.error("Error fetching result", err);
      }
    };

    intervalId = setInterval(checkStatus, 500);
    return () => clearInterval(intervalId);
  }, [taskId, onComplete]);

  // Determine which step we are currently on based on progress
  const currentStepIndex = Math.min(Math.floor(progress / 20), steps.length - 1);

  return (
    <div className="glass-panel animate-slide-up" style={{ padding: '3rem', maxWidth: '600px', margin: '4rem auto', width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <Loader2 className="animate-spin" size={64} color="var(--primary-beige)" style={{ margin: '0 auto 1.5rem auto' }} />
        <h2 style={{ fontSize: '2rem' }}>Analyzing Video...</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Please wait while our AI models process the footage.</p>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex || progress === 100;
            const isCurrent = index === currentStepIndex && progress < 100;
            const isPending = index > currentStepIndex;

            return (
              <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: isPending ? 0.4 : 1, transition: 'all 0.3s' }}>
                {isCompleted ? (
                  <CheckCircle2 size={24} color="var(--success)" />
                ) : isCurrent ? (
                  <Loader2 className="animate-spin" size={24} color="var(--primary-beige)" />
                ) : (
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid var(--border-color)' }} />
                )}
                <span style={{ fontSize: '1.1rem', fontWeight: isCurrent ? 600 : 400, color: isCurrent ? 'var(--text-primary)' : 'inherit' }}>
                  {step}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div className="progress-bg" style={{ marginBottom: '1rem' }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {message} • Estimated Time: 5–20 sec
        </p>
      </div>
    </div>
  );
};
