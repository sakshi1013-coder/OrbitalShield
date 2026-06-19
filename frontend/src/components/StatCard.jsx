import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, variant = 'cyan', delay = 0 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  const isDecimal = String(value).includes('.');

  useEffect(() => {
    if (!numericValue) {
      setCount(value);
      return;
    }
    let startTime = null;
    const duration = 1000;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentVal = progress * numericValue;
      
      const formatted = isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal);
      if (typeof value === 'string' && isNaN(value)) {
        const suffix = value.replace(/[0-9.]/g, '');
        setCount(`${formatted}${suffix}`);
      } else {
        setCount(formatted);
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };
    
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [value, numericValue, isDecimal]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`stat-card-${variant} rounded-2xl p-5 relative overflow-hidden group shadow-[0_8px_32px_rgba(0,0,0,0.2)]`}
    >
      {/* Background glow effect on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Animated background shape */}
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/5 group-hover:scale-150 transition-transform duration-700 ease-out" />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</p>
          <motion.h3 
            className="text-3xl font-black text-white tracking-tight"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.2 }}
          >
            {count}
          </motion.h3>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg relative group-hover:shadow-[0_0_20px_currentColor] transition-all duration-300 ${
          variant === 'cyan' ? 'bg-cyan-500/20 text-cyan-400' :
          variant === 'purple' ? 'bg-purple-500/20 text-purple-400' :
          variant === 'blue' ? 'bg-blue-500/20 text-blue-400' :
          variant === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
          variant === 'amber' ? 'bg-amber-500/20 text-amber-400' :
          'bg-rose-500/20 text-rose-400'
        }`}>
          <div className="absolute inset-0 rounded-xl border border-current opacity-30"></div>
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
