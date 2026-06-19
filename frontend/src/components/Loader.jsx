import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoPlanet } from 'react-icons/io5';

const loaderTexts = [
  'Initializing Mission Control...',
  'Connecting Ground Stations...',
  'Loading Satellites...',
  'Synchronizing Telemetry...',
  'Tracking Orbital Debris...',
  'Preparing Collision Engine...',
  'Launching Dashboard...'
];

const Loader = ({ onComplete }) => {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setTextIndex((prev) => {
        if (prev < loaderTexts.length - 1) return prev + 1;
        return prev;
      });
    }, 400); // 7 texts * 400ms = 2.8s total duration

    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => {
      clearInterval(textInterval);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#040814] overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
    >
      {/* Grid background */}
      <div className="absolute inset-0 z-0 opacity-20" style={{
        backgroundImage: `linear-gradient(rgba(0, 217, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 217, 255, 0.1) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
      }}></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Orbital animation container */}
        <div className="relative w-48 h-48 mb-12 flex items-center justify-center">
          {/* Glowing center Earth */}
          <motion.div
            className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_40px_rgba(0,217,255,0.6)] flex items-center justify-center z-10"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <div className="w-full h-full rounded-full border border-white/20"></div>
          </motion.div>

          {/* Orbit Rings */}
          <motion.div
            className="absolute w-32 h-32 rounded-full border border-cyan-500/30 shadow-[inset_0_0_20px_rgba(0,217,255,0.1)]"
            animate={{ rotateX: 360, rotateZ: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ transformStyle: 'preserve-3d' }}
          />
          <motion.div
            className="absolute w-48 h-48 rounded-full border border-purple-500/30 shadow-[inset_0_0_20px_rgba(124,92,255,0.1)]"
            animate={{ rotateY: 360, rotateZ: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Satellite */}
            <motion.div
              className="absolute top-0 left-1/2 w-4 h-4 -ml-2 -mt-2 bg-white rounded-sm shadow-[0_0_15px_white]"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              {/* Solar panels */}
              <div className="absolute top-1/2 -left-3 w-2 h-3 bg-blue-400 -translate-y-1/2"></div>
              <div className="absolute top-1/2 -right-3 w-2 h-3 bg-blue-400 -translate-y-1/2"></div>
            </motion.div>
          </motion.div>
        </div>

        {/* Branding */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            ORBITALSHIELD
          </h1>
          <p className="text-cyan-400/60 text-xs tracking-[0.2em] mt-2 uppercase">Space Traffic Management</p>
        </motion.div>

        {/* Dynamic Loading Text */}
        <div className="h-6 overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={textIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="text-gray-400 text-sm font-mono"
            >
              {loaderTexts[textIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress Line */}
        <div className="w-64 h-1 bg-gray-800 rounded-full mt-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 3.2, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Loader;
