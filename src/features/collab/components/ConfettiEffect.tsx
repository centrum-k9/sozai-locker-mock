import { useEffect, useState } from 'react';

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

interface ConfettiEffectProps {
  show: boolean;
  onComplete?: () => void;
}

const COLORS = [
  '#FFB6C1', // Light pink
  '#FFE4E1', // Misty rose  
  '#E0BBE4', // Light purple
  '#FFEFD5', // Papaya whip
  '#E1F5FE', // Light cyan
  '#F0F8FF', // Alice blue
  '#FFF0F5', // Lavender blush
  '#F5FFFA', // Mint cream
];

export const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ show, onComplete }) => {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!show) return;

    setIsVisible(true);

    // Create particles
    const newParticles: ConfettiParticle[] = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      });
    }
    setParticles(newParticles);

    // Animation loop
    let animationFrame: number;
    const animate = () => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          rotation: particle.rotation + particle.rotationSpeed,
          vy: particle.vy + 0.1, // Gravity
        })).filter(particle => particle.y < window.innerHeight + 50)
      );
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();

    // Auto cleanup after 2 seconds
    const timeout = setTimeout(() => {
      setIsVisible(false);
      setParticles([]);
      cancelAnimationFrame(animationFrame);
      onComplete?.();
    }, 2000);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(timeout);
    };
  }, [show, onComplete]);

  if (!isVisible || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: '50%',
            transform: `rotate(${particle.rotation}deg)`,
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
};