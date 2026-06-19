import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { IoTime, IoDocument } from 'react-icons/io5';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { logService } from '../services/dataService';
import { useDebounce } from '../hooks/useApi';

const entityColors = {
  'Satellite': 'text-cyan-400',
  'Mission': 'text-purple-400',
  'Debris': 'text-amber-400',
  'Collision': 'text-rose-400',
  'Alert': 'text-rose-400',
  'Telemetry': 'text-blue-400',
  'System': 'text-emerald-400'
};

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterEntity, setFilterEntity] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await logService.getAll({
        search: debouncedSearch, entity: filterEntity,
        page, limit: 20, sortBy: 'timestamp', sortOrder: 'desc'
      });
      setLogs(res.data.data);
      setTotalPages(res.data.pagination.pages);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filterEntity, page]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);
  useEffect(() => { setPage(1); }, [debouncedSearch, filterEntity]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Logs"
        subtitle="Complete audit trail of all system operations"
      />

      <div className="flex flex-wrap gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search logs..." />
        <select value={filterEntity} onChange={e => setFilterEntity(e.target.value)} className="form-select" style={{ width: 'auto', minWidth: '140px' }}>
          <option value="">All Entities</option>
          <option value="Satellite">Satellite</option>
          <option value="Mission">Mission</option>
          <option value="Debris">Debris</option>
          <option value="Collision">Collision</option>
          <option value="Alert">Alert</option>
          <option value="Telemetry">Telemetry</option>
          <option value="System">System</option>
        </select>
      </div>

      {loading ? <LoadingSkeleton rows={10} /> : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="data-table-container glass-card-strong">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Entity ID</th>
                <th>Details</th>
              </tr>
            </thead>
            <motion.tbody initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }}>
              {logs.map((log, i) => (
                <motion.tr key={log._id} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300 } } }}>
                  <td className="whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-400 text-xs tracking-wider">
                      <IoTime className="text-cyan-500/70" />
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </td>
                  <td className="font-semibold text-white text-sm tracking-wide">{log.action}</td>
                  <td>
                    <span className={`badge ${log.entity === 'Satellite' ? 'badge-info' : log.entity === 'Mission' ? 'badge-purple' : log.entity === 'Alert' || log.entity === 'Collision' ? 'badge-danger' : log.entity === 'Telemetry' ? 'badge-blue' : 'badge-success'}`}>
                      {log.entity}
                    </span>
                  </td>
                  <td className="font-mono text-xs text-cyan-400">{log.entityId || '—'}</td>
                  <td className="text-sm text-gray-400 max-w-md truncate">{log.details}</td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
          {logs.length === 0 && (
            <div className="p-16 text-center">
              <IoDocument className="text-5xl text-cyan-500/30 mx-auto mb-4" />
              <p className="text-gray-200 font-semibold mb-1">No Logs Found</p>
              <p className="text-gray-500 text-sm">No system activity matches your filters</p>
            </div>
          )}
        </motion.div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default Logs;
