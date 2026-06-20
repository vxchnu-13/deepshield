import React, { useCallback, useState } from 'react';
import { UploadCloud, FileVideo, ShieldCheck } from 'lucide-react';

interface UploadAreaProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onUpload, isUploading }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm'];
    if (validTypes.includes(file.type)) {
      onUpload(file);
    } else {
      alert('Unsupported file format. Please upload MP4, MOV, AVI, MKV, or WEBM.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>
        AI Deepfake Video Detector
      </h1>
      <p style={{ textAlign: 'center', fontSize: '1.1rem', maxWidth: '600px', marginBottom: '3rem' }}>
        Upload a video to analyze whether it appears authentic or AI-manipulated using advanced machine learning.
      </p>

      <div 
        className={`upload-area glass-panel animate-fade-in ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{ width: '100%' }}
      >
        <UploadCloud size={64} color="var(--primary-beige)" style={{ marginBottom: '1.5rem' }} />
        <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>Drag & Drop your video here</h2>
        <p>or</p>
        
        <label className="btn btn-primary" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
          Browse Files
          <input 
            type="file" 
            style={{ display: 'none' }} 
            accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm"
            onChange={handleChange}
            disabled={isUploading}
          />
        </label>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <FileVideo size={20} />
            <span>MP4, MOV, AVI, MKV, WEBM</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <span>Max file size: 500MB</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(214,194,161,0.05)', padding: '1rem 1.5rem', borderRadius: '12px' }}>
        <ShieldCheck size={24} color="var(--primary-beige)" />
        <span style={{ fontSize: '0.9rem' }}>
          <strong>Privacy Notice:</strong> Your videos are processed securely and are not stored on our servers permanently unless explicitly configured.
        </span>
      </div>
    </div>
  );
};
