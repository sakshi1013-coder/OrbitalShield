import React from 'react';

const riskMap = {
  'HIGH': { bg: 'bg-rose-500/15', text: 'text-rose-400', dot: 'bg-rose-400' },
  'MEDIUM': { bg: 'bg-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-400' },
  'SAFE': { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  'LOW': { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400' }
};

const RiskBadge = ({ risk }) => {
  const style = riskMap[risk] || riskMap['LOW'];
  return (
    <span className={`badge ${style.bg} ${style.text}`}>
      <span className={`w-2 h-2 rounded-full ${style.dot} ${risk === 'HIGH' ? 'animate-pulse' : ''}`}></span>
      {risk}
    </span>
  );
};

export default RiskBadge;
