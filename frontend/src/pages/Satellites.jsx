import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoAdd, IoGrid, IoList, IoEye, IoPencil, IoTrashBin } from 'react-icons/io5';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { satelliteService } from '../services/dataService';
import { useDebounce } from '../hooks/useApi';

const orbitTypes = ['LEO', 'MEO', 'GEO', 'HEO', 'SSO', 'Polar'];
const statuses = ['Operational', 'Degraded', 'Decommissioned', 'Launching'];

const initialForm = {
  name: '', orbitType: 'LEO', altitude: '', velocity: '', status: 'Operational',
  launchDate: '', operator: '', country: '', health: 100, description: ''
};

const Satellites = () => {
  const [satellites, setSatellites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterOrbit, setFilterOrbit] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('table');
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const fetchSatellites = useCallback(async () => {
    setLoading(true);
    try {
      const res = await satelliteService.getAll({
        search: debouncedSearch, orbitType: filterOrbit, status: filterStatus,
        page, limit: 10, sortBy: 'createdAt', sortOrder: 'desc'
      });
      setSatellites(res.data.data);
      setTotalPages(res.data.pagination.pages);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filterOrbit, filterStatus, page]);

  useEffect(() => { fetchSatellites(); }, [fetchSatellites]);
  useEffect(() => { setPage(1); }, [debouncedSearch, filterOrbit, filterStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await satelliteService.update(selected._id, form);
        toast.success('Satellite updated');
      } else {
        await satelliteService.create(form);
        toast.success('Satellite created');
      }
      setShowModal(false);
      setForm(initialForm);
      setIsEditing(false);
      fetchSatellites();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (sat) => {
    setForm({
      name: sat.name, orbitType: sat.orbitType, altitude: sat.altitude,
      velocity: sat.velocity, status: sat.status,
      launchDate: sat.launchDate?.split('T')[0] || '',
      operator: sat.operator, country: sat.country,
      health: sat.health, description: sat.description || ''
    });
    setSelected(sat);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await satelliteService.delete(selected._id);
      toast.success('Satellite deleted');
      setShowDelete(false);
      fetchSatellites();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const openCreate = () => {
    setForm(initialForm);
    setIsEditing(false);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Satellite Management"
        subtitle={`Monitor and manage all orbital satellites`}
        actions={
          <button onClick={openCreate} className="btn btn-primary">
            <IoAdd /> Add Satellite
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          <SearchBar value={search} onChange={setSearch} placeholder="Search satellites..." />
          <select value={filterOrbit} onChange={e => setFilterOrbit(e.target.value)} className="form-select" style={{ width: 'auto', minWidth: '130px' }}>
            <option value="">All Orbits</option>
            {orbitTypes.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="form-select" style={{ width: 'auto', minWidth: '140px' }}>
            <option value="">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg border transition-all ${viewMode === 'table' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-transparent text-gray-400 border-white/5 hover:text-white'}`}
          >
            <IoList />
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`p-2 rounded-lg border transition-all ${viewMode === 'cards' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-transparent text-gray-400 border-white/5 hover:text-white'}`}
          >
            <IoGrid />
          </button>
        </div>
      </div>

      {loading ? <LoadingSkeleton type={viewMode === 'cards' ? 'cards' : 'table'} /> : viewMode === 'table' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="data-table-container glass-card-strong">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Orbit</th><th>Altitude</th><th>Velocity</th>
                <th>Status</th><th>Health</th><th>Operator</th><th>Actions</th>
              </tr>
            </thead>
            <motion.tbody initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }}>
              {satellites.map(sat => (
                <motion.tr key={sat._id} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300 } } }}>
                  <td className="text-cyan-400 font-mono text-xs">{sat.satelliteId}</td>
                  <td className="font-semibold text-white tracking-wide">{sat.name}</td>
                  <td><span className="badge badge-info">{sat.orbitType}</span></td>
                  <td className="text-gray-300">{sat.altitude} km</td>
                  <td className="text-gray-300">{sat.velocity} km/s</td>
                  <td><StatusBadge status={sat.status} /></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="progress-bar w-16">
                        <div className="progress-bar-fill" style={{ width: `${sat.health}%`, background: sat.health > 70 ? '#22C55E' : sat.health > 40 ? '#FBBF24' : '#FF4D6D' }}></div>
                      </div>
                      <span className="text-xs text-gray-400">{sat.health}%</span>
                    </div>
                  </td>
                  <td className="text-xs text-gray-300">{sat.operator}</td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => { setSelected(sat); setShowDetail(true); }} className="p-1.5 rounded-lg hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 transition-colors"><IoEye /></button>
                      <button onClick={() => handleEdit(sat)} className="p-1.5 rounded-lg hover:bg-amber-500/20 text-gray-400 hover:text-amber-400 transition-colors"><IoPencil /></button>
                      <button onClick={() => { setSelected(sat); setShowDelete(true); }} className="p-1.5 rounded-lg hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors"><IoTrashBin /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </motion.div>
      ) : (
        <motion.div initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {satellites.map((sat) => (
            <motion.div key={sat._id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300 } } }} className="glass-card p-5 group hover:glow-cyan">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{sat.name}</h3>
                  <p className="text-xs font-mono text-cyan-500 mt-1">{sat.satelliteId}</p>
                </div>
                <StatusBadge status={sat.status} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div className="bg-[#040814]/50 rounded-xl p-2 border border-white/5"><span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Orbit</span> <span className="font-semibold text-gray-200">{sat.orbitType}</span></div>
                <div className="bg-[#040814]/50 rounded-xl p-2 border border-white/5"><span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Altitude</span> <span className="font-semibold text-gray-200">{sat.altitude} km</span></div>
                <div className="bg-[#040814]/50 rounded-xl p-2 border border-white/5"><span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Velocity</span> <span className="font-semibold text-gray-200">{sat.velocity} km/s</span></div>
                <div className="bg-[#040814]/50 rounded-xl p-2 border border-white/5"><span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Health</span> <span className={`font-semibold ${sat.health > 70 ? 'text-emerald-400' : sat.health > 40 ? 'text-amber-400' : 'text-rose-400'}`}>{sat.health}%</span></div>
              </div>
              <div className="progress-bar mb-4">
                <div className="progress-bar-fill" style={{ width: `${sat.health}%`, background: sat.health > 70 ? '#22C55E' : sat.health > 40 ? '#FBBF24' : '#FF4D6D' }}></div>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => { setSelected(sat); setShowDetail(true); }} className="btn btn-secondary text-xs py-1.5 px-3"><IoEye /> View</button>
                <button onClick={() => handleEdit(sat)} className="btn btn-secondary text-xs py-1.5 px-3"><IoPencil /> Edit</button>
                <button onClick={() => { setSelected(sat); setShowDelete(true); }} className="btn btn-danger text-xs py-1.5 px-3"><IoTrashBin /></button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={isEditing ? 'Edit Satellite' : 'Add Satellite'} maxWidth="640px">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="form-label">Name</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
            <div><label className="form-label">Orbit Type</label><select className="form-select" value={form.orbitType} onChange={e => setForm({...form, orbitType: e.target.value})}>{orbitTypes.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
            <div><label className="form-label">Altitude (km)</label><input type="number" className="form-input" value={form.altitude} onChange={e => setForm({...form, altitude: e.target.value})} required /></div>
            <div><label className="form-label">Velocity (km/s)</label><input type="number" step="0.01" className="form-input" value={form.velocity} onChange={e => setForm({...form, velocity: e.target.value})} required /></div>
            <div><label className="form-label">Status</label><select className="form-select" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>{statuses.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div><label className="form-label">Launch Date</label><input type="date" className="form-input" value={form.launchDate} onChange={e => setForm({...form, launchDate: e.target.value})} required /></div>
            <div><label className="form-label">Operator</label><input className="form-input" value={form.operator} onChange={e => setForm({...form, operator: e.target.value})} required /></div>
            <div><label className="form-label">Country</label><input className="form-input" value={form.country} onChange={e => setForm({...form, country: e.target.value})} required /></div>
            <div><label className="form-label">Health (%)</label><input type="number" min="0" max="100" className="form-input" value={form.health} onChange={e => setForm({...form, health: e.target.value})} /></div>
          </div>
          <div><label className="form-label">Description</label><textarea className="form-input" rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea></div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">{isEditing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Satellite Details">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="form-label">Satellite ID</p><p className="text-cyan-400 font-mono">{selected.satelliteId}</p></div>
              <div><p className="form-label">Name</p><p className="text-gray-200">{selected.name}</p></div>
              <div><p className="form-label">Orbit Type</p><span className="badge badge-info">{selected.orbitType}</span></div>
              <div><p className="form-label">Status</p><StatusBadge status={selected.status} /></div>
              <div><p className="form-label">Altitude</p><p className="text-gray-200">{selected.altitude} km</p></div>
              <div><p className="form-label">Velocity</p><p className="text-gray-200">{selected.velocity} km/s</p></div>
              <div><p className="form-label">Health</p><p className={selected.health > 70 ? 'text-emerald-400' : selected.health > 40 ? 'text-amber-400' : 'text-rose-400'}>{selected.health}%</p></div>
              <div><p className="form-label">Launch Date</p><p className="text-gray-200">{new Date(selected.launchDate).toLocaleDateString()}</p></div>
              <div><p className="form-label">Operator</p><p className="text-gray-200">{selected.operator}</p></div>
              <div><p className="form-label">Country</p><p className="text-gray-200">{selected.country}</p></div>
            </div>
            {selected.description && <div><p className="form-label">Description</p><p className="text-gray-400 text-sm">{selected.description}</p></div>}
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} message={`Delete satellite "${selected?.name}"? This action cannot be undone.`} />
    </div>
  );
};

export default Satellites;
