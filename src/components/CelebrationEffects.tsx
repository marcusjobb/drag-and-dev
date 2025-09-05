import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

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
          // Multiple bursts
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

            if (Date.now() < end) {
              requestAnimationFrame(frame);
            }
          };
          frame();
          break;
        case 'unicorn':
          // Rainbow explosion
          const colors = ['#ff0080', '#ff8000', '#ffff00', '#80ff00', '#00ff80', '#0080ff', '#8000ff'];
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: colors,
            shapes: ['circle', 'square'],
            gravity: 0.8,
            drift: 1
          });
          
          // Add some sparkles after
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
    }
  }, [trigger, type]);

  return null;
};