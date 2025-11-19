import React, { useEffect, useState, useRef } from 'react';
import { useTeaTimer } from '../hooks/useTeaTimer';
import type { Stage } from '../utils/parser';
import { formatStageText } from '../utils/formatTime';

interface TeaTimerProps {
  stages: Stage[];
  error: string | null;
  onResetTitle?: () => void;
}

export const TeaTimer: React.FC<TeaTimerProps> = ({ stages, error, onResetTitle }) => {
  const {
    currentStageIndex,
    currentStage,
    elapsedTime,
    status,
    visualState,
    start,
    pause,
    reset,
    restart,
    nextStage,
    prevStage,
    setStage,
  } = useTeaTimer(stages);

  // Apply visual state to body background
  useEffect(() => {
    document.body.className = '';
    if (visualState !== 'normal') {
      document.body.classList.add(`bg-${visualState}`);
    } else if (currentStage?.isRinse) {
      document.body.classList.add('bg-rinse');
    }
    return () => {
      document.body.className = '';
    };
  }, [visualState, currentStage]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key.toLowerCase();

      // Play/Pause: Space, k, cyrillic л, up arrow
      if (key === ' ' || key === 'k' || key === 'л' || key === 'arrowup') {
        e.preventDefault();
        if (error || stages.length === 0) return;
        triggerButtonPress(playPauseRef);
        if (status === 'idle' || status === 'paused') {
          start();
        } else {
          pause();
        }
      }
      // Prev Stage: Left arrow, j, cyrillic о
      else if (key === 'arrowleft' || key === 'j' || key === 'о') {
        e.preventDefault();
        if (error || stages.length === 0 || currentStageIndex === 0) return;
        triggerButtonPress(prevStageRef);
        prevStage();
      }
      // Next Stage: Right arrow, l, cyrillic д
      else if (key === 'arrowright' || key === 'l' || key === 'д') {
        e.preventDefault();
        if (error || stages.length === 0 || (currentStageIndex >= stages.length - 1 && status === 'finished')) return;
        triggerButtonPress(nextStageRef);
        nextStage();
      }
      // Reset Stage: Down arrow, r, delete, cyrillic к
      else if (key === 'arrowdown' || key === 'r' || key === 'delete' || key === 'к') {
        // Don't intercept Cmd+R or Ctrl+R (page reload)
        if (e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        if (error || stages.length === 0) return;
        triggerButtonPress(resetStageRef);
        reset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, error, stages.length, currentStageIndex, start, pause, prevStage, nextStage, reset]);

  // Tooltip state
  const [showTooltip, setShowTooltip] = useState(false);

  // Button refs for animation
  const playPauseRef = useRef<HTMLButtonElement>(null);
  const prevStageRef = useRef<HTMLButtonElement>(null);
  const nextStageRef = useRef<HTMLButtonElement>(null);
  const resetStageRef = useRef<HTMLButtonElement>(null);

  // Function to trigger button press animation
  const triggerButtonPress = (buttonRef: React.RefObject<HTMLButtonElement | null>) => {
    if (buttonRef.current) {
      buttonRef.current.classList.add('btn-press-animation');
      setTimeout(() => {
        buttonRef.current?.classList.remove('btn-press-animation');
      }, 200);
    }
  };

  // Safe access for display variables
  const duration = currentStage ? currentStage.duration : 0;
  const isRange = currentStage ? currentStage.type === 'range' : false;
  const min = currentStage ? currentStage.min : 0;
  const max = currentStage ? currentStage.max : 0;

  return (
    <>
      {/* Key bindings hint - fixed to viewport */}
      <div className="key-bindings-hint">
        <button
          className="hint-button"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip(!showTooltip)}
        >
          ⌨️
        </button>
        {showTooltip && (
          <div className="tooltip">
            <div className="tooltip-title">Keyboard Shortcuts</div>
            <div className="tooltip-item">
              <span className="tooltip-keys">Space / K / Л / ↑</span>
              <span className="tooltip-action">Start/Pause</span>
            </div>
            <div className="tooltip-item">
              <span className="tooltip-keys">← / J / О</span>
              <span className="tooltip-action">Prev Stage</span>
            </div>
            <div className="tooltip-item">
              <span className="tooltip-keys">→ / L / Д</span>
              <span className="tooltip-action">Next Stage</span>
            </div>
            <div className="tooltip-item">
              <span className="tooltip-keys">↓ / R / Del / К</span>
              <span className="tooltip-action">Reset Stage</span>
            </div>
          </div>
        )}
      </div>

      <div className="container">
        {currentStage?.isRinse && (
          <div className="rinse-watermark">RINSE</div>
        )}

      {error && (
        <div style={{ 
          color: '#ff6b6b', 
          border: '1px solid #ff6b6b', 
          padding: '1rem', 
          borderRadius: '8px',
          marginBottom: '1rem',
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
          width: '100%'
        }}>
          {error}
        </div>
      )}

      <div className={`timer-display ${visualState === 'blinking' ? 'bg-blinking' : ''}`}>
        {elapsedTime}s
      </div>
      
      {currentStage ? (
        <div className="stage-info">
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {isRange ? (
              <>Target: {min}s - {max}s</>
            ) : (
              <>Target: {duration}s</>
            )}
          </div>
          <div style={{ opacity: 0.7, marginBottom: '1rem' }}>
            Stage {currentStageIndex + 1} of {stages.length}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', fontSize: '1.1rem', alignItems: 'center' }}>
            {stages.map((stage, index) => (
              <React.Fragment key={index}>
                <span 
                  className="stage-item"
                  style={{ 
                    opacity: index === currentStageIndex ? 1 : 0.4,
                    fontWeight: index === currentStageIndex ? 'bold' : 'normal',
                    color: index === currentStageIndex ? '#fff' : (stage.isRinse ? '#b48ead' : '#aaa'),
                    backgroundColor: index === currentStageIndex ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    backdropFilter: index === currentStageIndex ? 'blur(10px)' : 'none',
                    WebkitBackdropFilter: index === currentStageIndex ? 'blur(10px)' : 'none',
                    border: index === currentStageIndex ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
                    borderRadius: '12px',
                    padding: '0.3em 0.6em',
                    boxShadow: index === currentStageIndex ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    display: 'inline-block'
                  }}
                  onClick={() => {
                    setStage(index);
                    reset();
                  }}
                  onMouseEnter={(e) => {
                    if (index !== currentStageIndex) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (index !== currentStageIndex) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.border = '1px solid transparent';
                    }
                  }}
                >
                  {formatStageText(stage.originalText)}
                </span>
                {index < stages.length - 1 && <span style={{ margin: '0 0.5rem', opacity: 0.3 }}>{stage.isRinse && !stages[index + 1].isRinse ? '|' : '→'}</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : (
        <div className="stage-info">
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Target: --
          </div>
          <div style={{ opacity: 0.7, marginBottom: '1rem' }}>
            Stage 0 of 0
          </div>
        </div>
      )}

      <div className="controls">
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          {status === 'idle' || status === 'paused' ? (
            <button 
              ref={playPauseRef}
              onClick={start} 
              className="btn-glass-green" 
              disabled={!!error || stages.length === 0}
            >
              Start
            </button>
          ) : (
            <button ref={playPauseRef} onClick={pause} className="btn-glass-green">
              Pause
            </button>
          )}
        </div>
        
        <div className="button-group stage-controls">
          <button ref={prevStageRef} className="btn-glass-dark" onClick={prevStage} disabled={!!error || stages.length === 0 || currentStageIndex === 0}>
            Prev Stage
          </button>

          <button ref={resetStageRef} className="btn-glass-dark" onClick={reset} disabled={!!error || stages.length === 0}>Reset Stage</button>
          
          <button 
            ref={nextStageRef}
            className="btn-glass-dark"
            onClick={nextStage} 
            disabled={!!error || stages.length === 0 || (currentStageIndex >= stages.length - 1 && status === 'finished')}
          >
            {currentStageIndex >= stages.length - 1 ? 'Finish' : 'Next Stage'}
          </button>
        </div>
      </div>

      <div style={{ marginTop: '2rem', borderTop: '1px solid #444', paddingTop: '1rem', width: '100%' }}>
        <button 
          className="btn-glass-burgundy"
          onClick={() => {
            if (window.confirm('Are you sure you want to restart the entire ceremony? This will reset all progress.')) {
              restart();
              onResetTitle?.();
            }
          }}
        >
          Restart Ceremony
        </button>
      </div>
    </div>
    </>
  );
};
