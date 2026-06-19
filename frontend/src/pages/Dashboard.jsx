import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { IoRocket, IoGameController, IoWarning, IoTrash, IoCheckmarkCircle, IoPulse, IoTime, IoArrowForward } from 'react-icons/io5';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import RiskBadge from '../components/RiskBadge';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { dashboardService } from '../services/dataService';

const COLORS = ['#22d3ee', '#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#f43f5e'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card-strong p-3 text-sm">
        <p className="text-gray-300 font-medium">{label || payload[0].name}</p>
        <p className="text-cyan-400 font-bold">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardService.getStats();
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSkeleton type="stats" />;

  const { summary, charts, recentAlerts, recentMissions, recentLogs } = stats;

  const orbitData = charts.orbitDistribution?.map(d => ({ name: d._id, value: d.count })) || [];
  const missionData = charts.missionStatusDist?.map(d => ({ name: d._id, value: d.count })) || [];
  const riskData = charts.collisionRiskDist?.map(d => ({ name: d._id, value: d.count })) || [];
  const healthData = charts.healthTrend || [];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={IoRocket} label="Total Satellites" value={summary.totalSatellites} variant="cyan" delay={0} />
        <StatCard icon={IoGameController} label="Active Missions" value={summary.activeMissions} variant="purple" delay={0.1} />
        <StatCard icon={IoWarning} label="Collision Alerts" value={summary.activeAlerts} variant="rose" delay={0.2} />
        <StatCard icon={IoTrash} label="Tracked Debris" value={summary.trackedDebris} variant="amber" delay={0.3} />
        <StatCard icon={IoCheckmarkCircle} label="Operational Sats" value={summary.operationalSatellites} variant="emerald" delay={0.4} />
        <StatCard icon={IoPulse} label="Avg Health" value={summary.avgHealth} variant="blue" delay={0.5} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Mission Status Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5 hover:glow-cyan transition-all duration-300">
          <h3 className="text-sm font-semibold text-gray-300 mb-4 tracking-wider uppercase">Mission Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <defs>
                <linearGradient id="grad-pie-0" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00D9FF" stopOpacity={1}/><stop offset="100%" stopColor="#008eb3" stopOpacity={1}/></linearGradient>
                <linearGradient id="grad-pie-1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7C5CFF" stopOpacity={1}/><stop offset="100%" stopColor="#5139bc" stopOpacity={1}/></linearGradient>
                <linearGradient id="grad-pie-2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22C55E" stopOpacity={1}/><stop offset="100%" stopColor="#16833e" stopOpacity={1}/></linearGradient>
                <linearGradient id="grad-pie-3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FBBF24" stopOpacity={1}/><stop offset="100%" stopColor="#a37c16" stopOpacity={1}/></linearGradient>
              </defs>
              <Pie data={missionData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value" stroke="rgba(0,0,0,0)">
                {missionData.map((_, i) => <Cell key={i} fill={`url(#grad-pie-${i % 4})`} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,217,255,0.05)' }} />
              <Legend formatter={(value) => <span className="text-xs text-gray-400 font-medium tracking-wide">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Orbit Distribution Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5 hover:glow-purple transition-all duration-300">
          <h3 className="text-sm font-semibold text-gray-300 mb-4 tracking-wider uppercase">Orbit Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={orbitData}>
              <defs>
                <linearGradient id="grad-bar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D9FF" stopOpacity={0.9}/>
                  <stop offset="100%" stopColor="#7C5CFF" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 217, 255, 0.05)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,217,255,0.05)' }} />
              <Bar dataKey="value" fill="url(#grad-bar)" radius={[4, 4, 0, 0]} animationDuration={1500} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Collision Risk Donut */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5 hover:glow-cyan transition-all duration-300">
          <h3 className="text-sm font-semibold text-gray-300 mb-4 tracking-wider uppercase">Collision Risk</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <defs>
                <linearGradient id="grad-high" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FF4D6D" stopOpacity={1}/><stop offset="100%" stopColor="#b3364d" stopOpacity={1}/></linearGradient>
                <linearGradient id="grad-med" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FBBF24" stopOpacity={1}/><stop offset="100%" stopColor="#a37c16" stopOpacity={1}/></linearGradient>
                <linearGradient id="grad-safe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22C55E" stopOpacity={1}/><stop offset="100%" stopColor="#16833e" stopOpacity={1}/></linearGradient>
              </defs>
              <Pie data={riskData.length > 0 ? riskData : [{ name: 'Safe', value: 1 }]} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value" stroke="rgba(0,0,0,0)">
                {riskData.map((entry, i) => (
                  <Cell key={i} fill={entry.name === 'HIGH' ? 'url(#grad-high)' : entry.name === 'MEDIUM' ? 'url(#grad-med)' : 'url(#grad-safe)'} />
                ))}
                {riskData.length === 0 && <Cell fill="url(#grad-safe)" />}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(value) => <span className="text-xs text-gray-400 font-medium tracking-wide">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Health Trend Line */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5 hover:glow-purple transition-all duration-300">
          <h3 className="text-sm font-semibold text-gray-300 mb-4 tracking-wider uppercase">Health Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={healthData}>
              <defs>
                <linearGradient id="grad-line" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D9FF" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#00D9FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 217, 255, 0.05)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="health" stroke="#00D9FF" strokeWidth={3} dot={{ fill: '#040814', stroke: '#00D9FF', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#7C5CFF', stroke: '#00D9FF' }} animationDuration={2000} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Alerts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-300">Recent Alerts</h3>
            <Link to="/alerts" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              View All <IoArrowForward />
            </Link>
          </div>
          <div className="space-y-3">
            {recentAlerts?.length > 0 ? recentAlerts.map((alert, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-200">{alert.satellite?.name || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">{alert.debris?.objectName || 'Unknown debris'}</p>
                </div>
                <RiskBadge risk={alert.riskLevel} />
              </div>
            )) : (
              <p className="text-gray-500 text-sm text-center py-4">No alerts</p>
            )}
          </div>
        </motion.div>

        {/* Latest Missions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-300">Latest Missions</h3>
            <Link to="/missions" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              View All <IoArrowForward />
            </Link>
          </div>
          <div className="space-y-3">
            {recentMissions?.length > 0 ? recentMissions.map((mission, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-200">{mission.name}</p>
                  <p className="text-xs text-gray-500">{mission.satellite?.name || 'Unassigned'}</p>
                </div>
                <StatusBadge status={mission.status} />
              </div>
            )) : (
              <p className="text-gray-500 text-sm text-center py-4">No missions</p>
            )}
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-300">Activity Feed</h3>
            <Link to="/logs" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              View All <IoArrowForward />
            </Link>
          </div>
          <div className="space-y-3">
            {recentLogs?.length > 0 ? recentLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-3 p-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="text-sm text-gray-300">{log.action}</p>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <IoTime className="text-[10px]" />
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-sm text-center py-4">No activity</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
