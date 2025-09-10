import { useEffect, useState } from 'react';
import { ConfettiEffect } from './ConfettiEffect';

interface ConfettiEvent {
  type: 'snsBoost' | 'invite' | 'upgrade';
}

export const GlobalConfetti: React.FC = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [eventType, setEventType] = useState<string>('');

  useEffect(() => {
    const handleShowConfetti = (event: CustomEvent<ConfettiEvent>) => {
      setEventType(event.detail.type);
      setShowConfetti(true);
    };

    // Listen for confetti events
    window.addEventListener('showConfetti', handleShowConfetti as EventListener);

    return () => {
      window.removeEventListener('showConfetti', handleShowConfetti as EventListener);
    };
  }, []);

  const handleComplete = () => {
    setShowConfetti(false);
    setEventType('');
  };

  return (
    <ConfettiEffect 
      show={showConfetti} 
      onComplete={handleComplete}
    />
  );
};