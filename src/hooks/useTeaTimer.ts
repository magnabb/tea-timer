import { useState, useEffect, useRef, useCallback } from 'react';
import type { Stage } from '../utils/parser';
import { playSignal, playContinuousSignal } from '../utils/audio';


export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

export const useTeaTimer = (stages: Stage[]) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [visualState, setVisualState] = useState<'normal' | 'red' | 'yellow' | 'blinking'>('normal');

  const intervalRef = useRef<number | null>(null);
  const stopSoundRef = useRef<(() => void) | null>(null);


  const currentStage = stages[currentStageIndex];

  const reset = useCallback(() => {
    setStatus('idle');
    setElapsedTime(0);
    setVisualState('normal');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const restart = useCallback(() => {
    setCurrentStageIndex(0);
    reset();
  }, [reset]);

  const start = useCallback(() => {
    if (status === 'running') return;
    setStatus('running');
  }, [status]);

  const pause = useCallback(() => {
    if (status !== 'running') return;
    setStatus('paused');
  }, [status]);

  const nextStage = useCallback(() => {
    if (currentStageIndex < stages.length - 1) {
      setCurrentStageIndex((prev) => prev + 1);
      reset();
    } else {
      setStatus('finished');
    }
  }, [currentStageIndex, stages.length, reset]);

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = window.setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status]);

  // Logic for visual/audio feedback
  useEffect(() => {
    if (!currentStage || status !== 'running') return;

    if (currentStage.type === 'range') {
      const { min, max } = currentStage;
      if (min && elapsedTime === min) {
        setVisualState('yellow');
        playSignal('alert');
      }
      if (max && elapsedTime === max) {
        setVisualState('blinking');
        // Use continuous sound for range stages at max time
        const stopSound = playContinuousSignal();
        stopSoundRef.current = stopSound;
      }
      // If we passed max, keep blinking
      if (max && elapsedTime > max) {
        setVisualState('blinking');
      }
    } else if (currentStage.type === 'fixed') {
      const { duration, isRinse } = currentStage;
      if (duration) {
        if (elapsedTime === duration - 5 && !isRinse) {
          setVisualState('yellow');
        }
        if (elapsedTime === duration) {
          // Play continuous sound for both regular fixed and rinse stages
          const stopSound = playContinuousSignal();
          stopSoundRef.current = stopSound;
          // Don't set status to 'finished' - let timer continue counting
        }
        // Keep blinking after duration is exceeded
        if (elapsedTime > duration) {
          setVisualState('blinking');
        }
      }
    }

  }, [elapsedTime, currentStage, status]);

  // Reset to first stage when stages configuration changes
  useEffect(() => {
    setCurrentStageIndex(0);
    reset();
  }, [stages, reset]);


  // Set up interaction listeners to stop continuous sound
  useEffect(() => {
    if (!stopSoundRef.current) return;

    const handleInteraction = () => {
      if (stopSoundRef.current) {
        stopSoundRef.current();
        stopSoundRef.current = null;
      }
    };

    // Listen for any user interaction
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [stopSoundRef.current]);


  const prevStage = useCallback(() => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex((prev) => prev - 1);
      reset();
    }
  }, [currentStageIndex, reset]);

  return {
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
    setStage: setCurrentStageIndex,
  };
};
