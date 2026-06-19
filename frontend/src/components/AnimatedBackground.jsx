import React, { useEffect, useState } from 'react';

const AnimatedBackground = ({ children }) => {
  const [stars, setStars] = useState([]);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate stars with colors (white, cyan, blue) and different sizes / opacities
    const starColors = ['#ffffff', '#00D9FF', '#60a5fa', '#93c5fd'];
    const newStars = Array.from({ length: 200 }).map(() => {
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      return {
        id: Math.random(),
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${(Math.random() * 1.8 + 0.6).toFixed(1)}px`,
        opacity: Math.random() * 0.7 + 0.15,
        color,
        animationDuration: `${(Math.random() * 4 + 3).toFixed(1)}s`,
        animationDelay: `${(Math.random() * 5).toFixed(1)}s`
      };
    });
    setStars(newStars);

    // Generate floating glowing particles
    const newParticles = Array.from({ length: 12 }).map(() => ({
      id: Math.random(),
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 120 + 60}px`,
      color: Math.random() > 0.5 ? 'rgba(0, 217, 255, 0.02)' : 'rgba(124, 92, 255, 0.02)',
      animationDuration: `${Math.random() * 25 + 25}s`,
      animationDelay: `${Math.random() * -20}s`
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#030712]">
      {/* BACKGROUND ATMOSPHERE LAYERS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        
        {/* Layer 2: Drifting Nebula Gradients (Opacity 5%-12%) */}
        <div 
          className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[140px]"
          style={{
            background: 'radial-gradient(circle, rgba(0, 217, 255, 0.09) 0%, rgba(124, 92, 255, 0.03) 70%, transparent 100%)',
            animation: 'nebula-drift-1 45s infinite ease-in-out alternate'
          }}
        />
        <div 
          className="absolute bottom-[-15%] right-[-5%] w-[65vw] h-[65vw] rounded-full blur-[160px]"
          style={{
            background: 'radial-gradient(circle, rgba(124, 92, 255, 0.08) 0%, rgba(0, 217, 255, 0.02) 65%, transparent 100%)',
            animation: 'nebula-drift-2 60s infinite ease-in-out alternate'
          }}
        />
        <div 
          className="absolute top-[30%] left-[25%] w-[45vw] h-[45vw] rounded-full blur-[130px]"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.07) 0%, rgba(0, 217, 255, 0.01) 70%, transparent 100%)',
            animation: 'nebula-drift-1 50s infinite ease-in-out alternate-reverse'
          }}
        />

        {/* Layer 3: Twinkling Stars (Different sizes, opacities, and colors) */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              backgroundColor: star.color,
              opacity: star.opacity,
              boxShadow: star.opacity > 0.6 ? `0 0 4px ${star.color}` : 'none',
              animation: `star-twinkle ${star.animationDuration} infinite ease-in-out`,
              animationDelay: star.animationDelay
            }}
          />
        ))}

        {/* Layer 4: Subtle Floating Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              background: `radial-gradient(circle, ${p.color} 0%, transparent 70%)`,
              animation: `particle-float ${p.animationDuration} infinite linear`,
              animationDelay: p.animationDelay
            }}
          />
        ))}

        {/* Layer 5: Shooting Stars (Occasional, subtle, pure CSS) */}
        <div className="shooting-star-1" />
        <div className="shooting-star-2" />

        {/* PLANET: Glowing planet partially visible in the bottom-right corner */}
        <div className="absolute right-[-250px] bottom-[-250px] w-[700px] h-[700px] rounded-full z-10 pointer-events-none select-none opacity-25">
          {/* Planet Atmosphere Glow */}
          <div 
            className="absolute inset-0 rounded-full blur-[70px]"
            style={{
              background: 'radial-gradient(circle, rgba(0, 217, 255, 0.22) 0%, rgba(0, 142, 255, 0.08) 55%, transparent 75%)',
              animation: 'planet-glow-pulse 10s infinite ease-in-out'
            }}
          />
          {/* Planet Shadow and Surface Texture Gradient */}
          <div 
            className="absolute inset-[60px] rounded-full shadow-[inset_-40px_-40px_100px_rgba(0,0,0,0.95),0_0_50px_rgba(0,217,255,0.3)]"
            style={{
              background: 'linear-gradient(135deg, #020718 10%, #082054 50%, #00bfff 90%)'
            }}
          />
          {/* Atmospheric Rim Highlight */}
          <div className="absolute inset-[60px] rounded-full border border-cyan-400/25 blur-[1px]" />
        </div>

        {/* OVERLAY: Dark overlay gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/10 via-[#030712]/35 to-[#030712]/55 z-20 pointer-events-none" />
      </div>
      
      {/* Content Container */}
      <div className="relative z-30 w-full min-h-screen">
        {children}
      </div>

      <style>{`
        @keyframes star-twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.8); }
          50% { opacity: 0.95; transform: scale(1.15); }
        }
        @keyframes particle-float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-40px) rotate(180deg); }
          100% { transform: translateY(0) rotate(360deg); }
        }
        @keyframes nebula-drift-1 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(3%, -3%) scale(1.05); }
        }
        @keyframes nebula-drift-2 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-3%, 3%) scale(1.06); }
        }
        @keyframes planet-glow-pulse {
          0%, 100% { transform: scale(0.98); opacity: 0.9; }
          50% { transform: scale(1.02); opacity: 1; filter: brightness(1.15); }
        }
        @keyframes shooting-star-anim {
          0% {
            transform: translate(0, 0) rotate(-35deg) scaleX(0);
            opacity: 0;
          }
          2% {
            transform: translate(-150px, 100px) rotate(-35deg) scaleX(1);
            opacity: 0.7;
          }
          4% {
            transform: translate(-350px, 240px) rotate(-35deg) scaleX(0);
            opacity: 0;
          }
          100% {
            transform: translate(-350px, 240px) rotate(-35deg) scaleX(0);
            opacity: 0;
          }
        }
        .shooting-star-1 {
          position: absolute;
          top: 15%;
          left: 85%;
          width: 80px;
          height: 1.5px;
          background: linear-gradient(90deg, #00D9FF 0%, rgba(255, 255, 255, 0.4) 40%, transparent 100%);
          transform-origin: right;
          opacity: 0;
          animation: shooting-star-anim 16s infinite linear;
          animation-delay: 2s;
        }
        .shooting-star-2 {
          position: absolute;
          top: 35%;
          left: 95%;
          width: 100px;
          height: 1.5px;
          background: linear-gradient(90deg, #7C5CFF 0%, rgba(0, 217, 255, 0.3) 40%, transparent 100%);
          transform-origin: right;
          opacity: 0;
          animation: shooting-star-anim 20s infinite linear;
          animation-delay: 11s;
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;
