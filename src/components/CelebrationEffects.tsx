import React, { useEffect } from 'react';

interface CelebrationEffectsProps {
  trigger: number;
  type?: 'confetti' | 'sparkles' | 'fireworks' | 'unicorn';
}

export const CelebrationEffects: React.FC<CelebrationEffectsProps> = ({ 
  trigger, 
  type = 'confetti' 
}) => {
  useEffect(() => {
    if (trigger > 0) {
      (async () => {
        try {
          const { default: confetti } = await import('canvas-confetti');
          switch (type) {
            case 'confetti':
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7']
              });
              break;
            case 'sparkles':
              confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 },
                shapes: ['star'],
                colors: ['#FFD700', '#FFA500', '#FF69B4', '#00CED1']
              });
              break;
            case 'fireworks':
              const duration = 3 * 1000;
              const end = Date.now() + duration;
              const frame = () => {
                confetti({
                  particleCount: 2,
                  angle: 60,
                  spread: 55,
                  origin: { x: 0, y: 0.8 },
                  colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00']
                });
                confetti({
                  particleCount: 2,
                  angle: 120,
                  spread: 55,
                  origin: { x: 1, y: 0.8 },
                  colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00']
                });
                if (Date.now() < end) requestAnimationFrame(frame);
              };
              frame();
              break;
            case 'unicorn':
              const colors = ['#ff0080', '#ff8000', '#ffff00', '#80ff00', '#00ff80', '#0080ff', '#8000ff'];
              confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors,
                shapes: ['circle', 'square'],
                gravity: 0.8,
                drift: 1
              });
              setTimeout(() => {
                confetti({
                  particleCount: 30,
                  spread: 40,
                  origin: { y: 0.8 },
                  shapes: ['star'],
                  colors: ['#FFD700', '#FF69B4', '#00CED1'],
                  gravity: 0.3
                });
              }, 500);
              break;
          }
        } catch (e) {
          // Fail silently so UI never crashes due to animations
          console.warn('Celebration effect failed to load:', e);
        }
      })();
    }
  }, [trigger, type]);

  return null;
};