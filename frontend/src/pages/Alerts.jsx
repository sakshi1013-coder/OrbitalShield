import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { IoCheckmarkCircle, IoTrashBin } from 'react-icons/io5';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import RiskBadge from '../components/RiskBadge';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { alertService } from '../services/dataService';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRisk, setFilterRisk] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showResolve, setShowResolve] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await alertService.getAll({
        status: filterStatus, riskLevel: filterRisk,
        page, limit: 10, sortBy: 'timestamp', sortOrder: 'desc'
      });
      setAlerts(res.data.data);
      setTotalPages(res.data.pagination.pages);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterRisk, page]);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  const handleResolve = async () => {
    try {
      await alertService.resolve(selected._id, notes);
      toast.success('Alert resolved');
      setShowResolve(false);
      setNotes('');
      fetchAlerts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await alertService.delete(selected._id);
      toast.success('Alert deleted');
      setShowDelete(false);
      fetchAlerts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alert Center"
        subtitle="Monitor and respond to collision risk alerts"
      />

      <div className="flex gap-3">
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} className="form-select" style={{ width: 'auto', minWidth: '140px' }}>
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Resolved">Resolved</option>
        </select>
        <select value={filterRisk} onChange={e => { setFilterRisk(e.target.value); setPage(1); }} className="form-select" style={{ width: 'auto', minWidth: '140px' }}>
          <option value="">All Risks</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
        </select>
      </div>

      {loading ? <LoadingSkeleton /> : (
        <motion.div initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }} className="space-y-4">
          {alerts.map((alert, i) => (
            <motion.div
              key={alert._id}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300 } } }}
              className={`glass-card-strong p-5 group transition-all duration-300 ${alert.riskLevel === 'HIGH' && alert.status === 'Active' ? 'border-rose-500/30 hover:glow-rose' : 'hover:glow-cyan'}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-cyan-400 font-mono text-sm tracking-wider">{alert.alertId}</span>
                    <RiskBadge risk={alert.riskLevel} />
                    <StatusBadge status={alert.status} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="bg-[#040814]/50 rounded-lg p-2 border border-white/5"><span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Satellite</span> <span className="font-semibold text-gray-200">{alert.satellite?.name || 'Unknown'}</span></div>
                    <div className="bg-[#040814]/50 rounded-lg p-2 border border-white/5"><span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Debris</span> <span className="font-semibold text-gray-200">{alert.debris?.objectName || 'Unknown'}</span></div>
                    <div className="bg-[#040814]/50 rounded-lg p-2 border border-white/5"><span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Time</span> <span className="text-gray-300">{new Date(alert.timestamp).toLocaleString()}</span></div>
                  </div>
                  {alert.operatorNotes && (
                    <div className="mt-3 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
                      <p className="text-xs text-cyan-300/80 italic leading-relaxed"><span className="font-semibold text-cyan-400 mr-1">Notes:</span> {alert.operatorNotes}</p>
                    </div>
                  )}
                </div>
                <div className="flex sm:flex-col gap-2 justify-end sm:border-l border-white/5 sm:pl-5">
                  {alert.status === 'Active' && (
                    <button onClick={() => { setSelected(alert); setShowResolve(true); }} className="btn btn-success text-xs w-full justify-center">
                      <IoCheckmarkCircle /> Resolve
                    </button>
                  )}
                  <button onClick={() => { setSelected(alert); setShowDelete(true); }} className="btn btn-danger text-xs w-full justify-center">
                    <IoTrashBin /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {alerts.length === 0 && (
            <div className="glass-card-strong p-16 text-center">
              <IoCheckmarkCircle className="text-5xl text-emerald-400 mx-auto mb-4" />
              <p className="text-gray-200 font-semibold mb-1">No Active Alerts</p>
              <p className="text-gray-500 text-sm">The orbital environment is clear</p>
            </div>
          )}
        </motion.div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Resolve Modal */}
      <Modal isOpen={showResolve} onClose={() => setShowResolve(false)} title="Resolve Alert" maxWidth="480px">
        <div className="space-y-4">
          <p className="text-gray-300 text-sm">Resolving alert <span className="text-cyan-400 font-mono">{selected?.alertId}</span></p>
          <div>
            <label className="form-label">Operator Notes</label>
            <textarea className="form-input" rows="4" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add resolution notes..."></textarea>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowResolve(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={handleResolve} className="btn btn-success">Resolve Alert</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} message={`Delete alert "${selected?.alertId}"?`} />
    </div>
  );
};

export default Alerts;
