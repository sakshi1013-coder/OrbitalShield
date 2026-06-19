import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoWarning, IoRefresh, IoShield } from 'react-icons/io5';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import RiskBadge from '../components/RiskBadge';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { collisionService } from '../services/dataService';

const Collisions = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ high: 0, medium: 0 });

  const runDetection = async () => {
    setLoading(true);
    try {
      const res = await collisionService.detect();
      const data = res.data.data;
      setResults(data);
      setStats({
        high: data.filter(r => r.risk === 'HIGH').length,
        medium: data.filter(r => r.risk === 'MEDIUM').length
      });
      toast.success(`Detection complete: ${data.length} conflicts found`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { runDetection(); }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Collision Detection"
        subtitle="Analyze orbital conflicts between satellites and debris"
        actions={
          <button onClick={runDetection} className="btn btn-primary" disabled={loading}>
            <IoRefresh className={loading ? 'animate-spin' : ''} /> Run Detection
          </button>
        }
      />

      {/* Risk Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card stat-card-rose p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-500/10"><IoWarning className="text-2xl text-rose-400" /></div>
          <div><p className="text-sm text-gray-400">High Risk</p><p className="text-2xl font-bold text-rose-400" style={{ fontFamily: 'Orbitron' }}>{stats.high}</p></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card stat-card-amber p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10"><IoWarning className="text-2xl text-amber-400" /></div>
          <div><p className="text-sm text-gray-400">Medium Risk</p><p className="text-2xl font-bold text-amber-400" style={{ fontFamily: 'Orbitron' }}>{stats.medium}</p></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card stat-card-emerald p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10"><IoShield className="text-2xl text-emerald-400" /></div>
          <div><p className="text-sm text-gray-400">Total Conflicts</p><p className="text-2xl font-bold text-emerald-400" style={{ fontFamily: 'Orbitron' }}>{results.length}</p></div>
        </motion.div>
      </div>

      {/* Results Table */}
      {loading ? <LoadingSkeleton /> : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="data-table-container glass-card-strong">
          <table className="data-table">
            <thead>
              <tr>
                <th>Satellite</th>
                <th>Sat. Altitude</th>
                <th>Debris</th>
                <th>Debris Altitude</th>
                <th>Difference (km)</th>
                <th>Risk Level</th>
                <th>Recommended Action</th>
              </tr>
            </thead>
            <motion.tbody initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }}>
              {results.map((r, i) => (
                <motion.tr
                  key={i}
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300 } } }}
                  className={r.risk === 'HIGH' ? 'bg-rose-500/[0.03] hover:bg-rose-500/[0.05]' : ''}
                >
                  <td>
                    <div>
                      <p className="font-semibold text-white tracking-wide">{r.satellite.name}</p>
                      <p className="text-xs text-cyan-400 font-mono">{r.satellite.satelliteId}</p>
                    </div>
                  </td>
                  <td className="text-gray-300">{r.satellite.altitude} km</td>
                  <td>
                    <div>
                      <p className="font-semibold text-gray-200">{r.debris.objectName}</p>
                      <p className="text-xs text-gray-500 font-mono">{r.debris.debrisId}</p>
                    </div>
                  </td>
                  <td className="text-gray-300">{r.debris.altitude} km</td>
                  <td>
                    <span className={`font-bold ${r.risk === 'HIGH' ? 'text-rose-400' : 'text-amber-400'}`}>
                      {r.altitudeDifference} km
                    </span>
                  </td>
                  <td><RiskBadge risk={r.risk} /></td>
                  <td className="text-sm max-w-xs text-gray-400 leading-relaxed">{r.recommendedAction}</td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
          {results.length === 0 && (
            <div className="p-12 text-center">
              <IoShield className="text-5xl text-emerald-400 mx-auto mb-3" />
              <p className="text-gray-300 font-semibold">All Clear</p>
              <p className="text-gray-500 text-sm">No collision risks detected</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Collisions;
