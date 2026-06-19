import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { IoAdd, IoPencil, IoTrashBin, IoEye } from 'react-icons/io5';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { missionService, satelliteService } from '../services/dataService';
import { useDebounce } from '../hooks/useApi';

const missionTypes = ['Observation', 'Communication', 'Navigation', 'Research', 'Defense', 'Commercial'];
const missionStatuses = ['Scheduled', 'Active', 'Completed', 'Delayed'];

const initialForm = {
  name: '', missionCode: '', satellite: '', missionType: 'Observation',
  destinationOrbit: '', launchDate: '', duration: '', status: 'Scheduled', description: ''
};

const Missions = () => {
  const [missions, setMissions] = useState([]);
  const [satellites, setSatellites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const fetchMissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await missionService.getAll({
        search: debouncedSearch, status: filterStatus, missionType: filterType,
        page, limit: 10, sortBy: 'createdAt', sortOrder: 'desc'
      });
      setMissions(res.data.data);
      setTotalPages(res.data.pagination.pages);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filterStatus, filterType, page]);

  useEffect(() => { fetchMissions(); }, [fetchMissions]);
  useEffect(() => { setPage(1); }, [debouncedSearch, filterStatus, filterType]);

  useEffect(() => {
    const fetchSatellites = async () => {
      try {
        const res = await satelliteService.getAll({ limit: 100 });
        setSatellites(res.data.data);
      } catch (err) {
        console.error('Failed to fetch satellites');
      }
    };
    fetchSatellites();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await missionService.update(selected._id, form);
        toast.success('Mission updated');
      } else {
        await missionService.create(form);
        toast.success('Mission created');
      }
      setShowModal(false);
      setForm(initialForm);
      setIsEditing(false);
      fetchMissions();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (mission) => {
    setForm({
      name: mission.name, missionCode: mission.missionCode,
      satellite: mission.satellite?._id || '', missionType: mission.missionType,
      destinationOrbit: mission.destinationOrbit,
      launchDate: mission.launchDate?.split('T')[0] || '',
      duration: mission.duration, status: mission.status,
      description: mission.description || ''
    });
    setSelected(mission);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await missionService.delete(selected._id);
      toast.success('Mission deleted');
      setShowDelete(false);
      fetchMissions();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mission Control"
        subtitle="Manage space missions and operations"
        actions={<button onClick={() => { setForm(initialForm); setIsEditing(false); setShowModal(true); }} className="btn btn-primary"><IoAdd /> New Mission</button>}
      />

      <div className="flex flex-wrap gap-3 items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search missions..." />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="form-select" style={{ width: 'auto', minWidth: '140px' }}>
          <option value="">All Statuses</option>
          {missionStatuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="form-select" style={{ width: 'auto', minWidth: '150px' }}>
          <option value="">All Types</option>
          {missionTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {loading ? <LoadingSkeleton /> : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="data-table-container glass-card-strong">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th><th>Mission Name</th><th>Code</th><th>Satellite</th>
                <th>Type</th><th>Status</th><th>Launch Date</th><th>Duration</th><th>Actions</th>
              </tr>
            </thead>
            <motion.tbody initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }}>
              {missions.map(m => (
                <motion.tr key={m._id} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300 } } }}>
                  <td className="text-cyan-400 font-mono text-xs">{m.missionId}</td>
                  <td className="font-semibold text-white tracking-wide">{m.name}</td>
                  <td className="font-mono text-xs text-purple-400">{m.missionCode}</td>
                  <td className="text-sm text-gray-300">{m.satellite?.name || 'N/A'}</td>
                  <td><span className="badge badge-purple">{m.missionType}</span></td>
                  <td><StatusBadge status={m.status} /></td>
                  <td className="text-sm text-gray-400">{new Date(m.launchDate).toLocaleDateString()}</td>
                  <td className="text-sm text-gray-400">{m.duration}</td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => { setSelected(m); setShowDetail(true); }} className="p-1.5 rounded-lg hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 transition-colors"><IoEye /></button>
                      <button onClick={() => handleEdit(m)} className="p-1.5 rounded-lg hover:bg-amber-500/20 text-gray-400 hover:text-amber-400 transition-colors"><IoPencil /></button>
                      <button onClick={() => { setSelected(m); setShowDelete(true); }} className="p-1.5 rounded-lg hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors"><IoTrashBin /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </motion.div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={isEditing ? 'Edit Mission' : 'New Mission'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="form-label">Mission Name</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
            <div><label className="form-label">Mission Code</label><input className="form-input" value={form.missionCode} onChange={e => setForm({...form, missionCode: e.target.value})} required /></div>
            <div><label className="form-label">Satellite</label><select className="form-select" value={form.satellite} onChange={e => setForm({...form, satellite: e.target.value})} required><option value="">Select Satellite</option>{satellites.map(s => <option key={s._id} value={s._id}>{s.name} ({s.satelliteId})</option>)}</select></div>
            <div><label className="form-label">Mission Type</label><select className="form-select" value={form.missionType} onChange={e => setForm({...form, missionType: e.target.value})}>{missionTypes.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            <div><label className="form-label">Destination Orbit</label><input className="form-input" value={form.destinationOrbit} onChange={e => setForm({...form, destinationOrbit: e.target.value})} required /></div>
            <div><label className="form-label">Launch Date</label><input type="date" className="form-input" value={form.launchDate} onChange={e => setForm({...form, launchDate: e.target.value})} required /></div>
            <div><label className="form-label">Duration</label><input className="form-input" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} required placeholder="e.g., 6 months" /></div>
            <div><label className="form-label">Status</label><select className="form-select" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>{missionStatuses.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          </div>
          <div><label className="form-label">Description</label><textarea className="form-input" rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea></div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">{isEditing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Mission Details">
        {selected && (
          <div className="grid grid-cols-2 gap-4">
            <div><p className="form-label">Mission ID</p><p className="text-cyan-400 font-mono">{selected.missionId}</p></div>
            <div><p className="form-label">Name</p><p className="text-gray-200">{selected.name}</p></div>
            <div><p className="form-label">Code</p><p className="text-purple-400 font-mono">{selected.missionCode}</p></div>
            <div><p className="form-label">Satellite</p><p className="text-gray-200">{selected.satellite?.name || 'N/A'}</p></div>
            <div><p className="form-label">Type</p><span className="badge badge-purple">{selected.missionType}</span></div>
            <div><p className="form-label">Status</p><StatusBadge status={selected.status} /></div>
            <div><p className="form-label">Destination</p><p className="text-gray-200">{selected.destinationOrbit}</p></div>
            <div><p className="form-label">Duration</p><p className="text-gray-200">{selected.duration}</p></div>
            <div className="col-span-2"><p className="form-label">Description</p><p className="text-gray-400 text-sm">{selected.description || 'No description'}</p></div>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} message={`Delete mission "${selected?.name}"?`} />
    </div>
  );
};

export default Missions;
