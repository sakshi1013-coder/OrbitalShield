import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { IoPlay, IoStop, IoPulse } from 'react-icons/io5';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { telemetryService } from '../services/dataService';

const ProgressBar = ({ label, value, max = 100, color, unit = '%' }) => {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="font-medium" style={{ color }}>{typeof value === 'number' ? value.toFixed(1) : value}{unit}</span>
      </div>
      <div className="progress-bar">
        <motion.div
          className="progress-bar-fill"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

const Telemetry = () => {
  const [telemetry, setTelemetry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const intervalRef = useRef(null);

  const fetchTelemetry = async () => {
    try {
      const res = await telemetryService.getAll();
      setTelemetry(res.data.data);
    } catch (err) {
      console.error('Failed to fetch telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async () => {
    try {
      const res = await telemetryService.simulate();
      setTelemetry(res.data.data);
    } catch (err) {
      console.error('Simulation error:', err);
    }
  };

  const startSimulation = () => {
    setSimulating(true);
    toast.success('Telemetry simulation started');
    runSimulation();
    intervalRef.current = setInterval(runSimulation, 5000);
  };

  const stopSimulation = () => {
    setSimulating(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    toast.success('Telemetry simulation stopped');
  };

  useEffect(() => {
    fetchTelemetry();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const getColor = (val, type) => {
    if (type === 'temp') return val > 40 ? '#f43f5e' : val > 20 ? '#f59e0b' : '#22d3ee';
    if (type === 'cpu') return val > 70 ? '#f43f5e' : val > 40 ? '#f59e0b' : '#10b981';
    return val > 70 ? '#10b981' : val > 40 ? '#f59e0b' : '#f43f5e';
  };

  if (loading) return <LoadingSkeleton type="cards" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Telemetry Monitoring"
        subtitle="Real-time satellite health and performance data"
        actions={
          <div className="flex gap-3">
            {!simulating ? (
              <button onClick={startSimulation} className="btn btn-primary"><IoPlay /> Start Simulation</button>
            ) : (
              <button onClick={stopSimulation} className="btn btn-danger"><IoStop /> Stop Simulation</button>
            )}
          </div>
        }
      />

      {simulating && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 px-4 py-2 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
          <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-sm text-cyan-400">Live simulation active — updating every 5 seconds</span>
        </motion.div>
      )}

      <motion.div initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {telemetry.map((t, i) => (
          <motion.div
            key={t._id}
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300 } } }}
            className="glass-card p-5 group hover:glow-cyan transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold text-white tracking-wide group-hover:text-cyan-400 transition-colors">{t.satellite?.name || 'Unknown'}</p>
                <p className="text-xs text-cyan-500 font-mono mt-1">{t.satellite?.satelliteId}</p>
              </div>
              <StatusBadge status={t.communicationStatus} />
            </div>

            <ProgressBar label="Battery" value={t.battery} color={getColor(t.battery, 'battery')} />
            <ProgressBar label="Signal Strength" value={t.signalStrength} color={getColor(t.signalStrength, 'signal')} />
            <ProgressBar label="CPU Usage" value={t.cpuUsage} color={getColor(t.cpuUsage, 'cpu')} />

            <div className="flex justify-between items-center text-xs mt-4 pt-3 border-t border-white/5">
              <div className="bg-[#040814]/50 rounded px-2 py-1 border border-white/5">
                <span className="text-gray-500 uppercase tracking-widest text-[10px] mr-2">Temp</span>
                <span className="font-semibold" style={{ color: getColor(t.temperature, 'temp') }}>{t.temperature}°C</span>
              </div>
              <div className="text-gray-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {new Date(t.lastUpdated).toLocaleTimeString()}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Telemetry;
