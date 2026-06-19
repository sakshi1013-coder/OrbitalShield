import React from 'react';
import { motion } from 'framer-motion';

const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
    >
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          <span className="gradient-text">{title}</span>
        </h1>
        {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-3">{actions}</div>}
    </motion.div>
  );
};

export default PageHeader;
