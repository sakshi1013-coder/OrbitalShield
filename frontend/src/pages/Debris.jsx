import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { IoAdd, IoPencil, IoTrashBin } from 'react-icons/io5';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { debrisService } from '../services/dataService';
import { useDebounce } from '../hooks/useApi';

const sizes = ['Small (<10cm)', 'Medium (10cm-1m)', 'Large (>1m)'];
const riskCategories = ['Low', 'Medium', 'High', 'Critical'];
const trackingStatuses = ['Tracked', 'Untracked', 'Lost'];

const initialForm = {
  objectName: '', altitude: '', velocity: '', objectSize: 'Small (<10cm)',
  riskCategory: 'Low', trackingStatus: 'Tracked', countryOfOrigin: '', description: ''
};

const Debris = () => {
  const [debris, setDebris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('');
  const [filterTracking, setFilterTracking] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const fetchDebris = useCallback(async () => {
    setLoading(true);
    try {
      const res = await debrisService.getAll({
        search: debouncedSearch, riskCategory: filterRisk, trackingStatus: filterTracking,
        page, limit: 10, sortBy: 'createdAt', sortOrder: 'desc'
      });
      setDebris(res.data.data);
      setTotalPages(res.data.pagination.pages);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filterRisk, filterTracking, page]);

  useEffect(() => { fetchDebris(); }, [fetchDebris]);
  useEffect(() => { setPage(1); }, [debouncedSearch, filterRisk, filterTracking]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await debrisService.update(selected._id, form);
        toast.success('Debris updated');
      } else {
        await debrisService.create(form);
        toast.success('Debris added');
      }
      setShowModal(false);
      setForm(initialForm);
      setIsEditing(false);
      fetchDebris();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (item) => {
    setForm({
      objectName: item.objectName, altitude: item.altitude, velocity: item.velocity,
      objectSize: item.objectSize, riskCategory: item.riskCategory,
      trackingStatus: item.trackingStatus, countryOfOrigin: item.countryOfOrigin,
      description: item.description || ''
    });
    setSelected(item);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await debrisService.delete(selected._id);
      toast.success('Debris removed');
      setShowDelete(false);
      fetchDebris();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orbital Debris"
        subtitle="Track and manage orbital debris objects"
        actions={<button onClick={() => { setForm(initialForm); setIsEditing(false); setShowModal(true); }} className="btn btn-primary"><IoAdd /> Add Debris</button>}
      />

      <div className="flex flex-wrap gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search debris..." />
        <select value={filterRisk} onChange={e => setFilterRisk(e.target.value)} className="form-select" style={{ width: 'auto', minWidth: '140px' }}>
          <option value="">All Risks</option>
          {riskCategories.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={filterTracking} onChange={e => setFilterTracking(e.target.value)} className="form-select" style={{ width: 'auto', minWidth: '140px' }}>
          <option value="">All Tracking</option>
          {trackingStatuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <LoadingSkeleton /> : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="data-table-container glass-card-strong">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th><th>Object Name</th><th>Altitude</th><th>Velocity</th>
                <th>Size</th><th>Risk</th><th>Tracking</th><th>Origin</th><th>Actions</th>
              </tr>
            </thead>
            <motion.tbody initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }}>
              {debris.map(d => (
                <motion.tr key={d._id} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300 } } }}>
                  <td className="text-cyan-400 font-mono text-xs">{d.debrisId}</td>
                  <td className="font-semibold text-white tracking-wide">{d.objectName}</td>
                  <td className="text-gray-300">{d.altitude} km</td>
                  <td className="text-gray-300">{d.velocity} km/s</td>
                  <td><span className="badge badge-gray">{d.objectSize}</span></td>
                  <td><StatusBadge status={d.riskCategory} /></td>
                  <td><StatusBadge status={d.trackingStatus} /></td>
                  <td className="text-sm text-gray-400">{d.countryOfOrigin}</td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(d)} className="p-1.5 rounded-lg hover:bg-amber-500/20 text-gray-400 hover:text-amber-400 transition-colors"><IoPencil /></button>
                      <button onClick={() => { setSelected(d); setShowDelete(true); }} className="p-1.5 rounded-lg hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors"><IoTrashBin /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </motion.div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={isEditing ? 'Edit Debris' : 'Add Debris'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="form-label">Object Name</label><input className="form-input" value={form.objectName} onChange={e => setForm({...form, objectName: e.target.value})} required /></div>
            <div><label className="form-label">Altitude (km)</label><input type="number" className="form-input" value={form.altitude} onChange={e => setForm({...form, altitude: e.target.value})} required /></div>
            <div><label className="form-label">Velocity (km/s)</label><input type="number" step="0.01" className="form-input" value={form.velocity} onChange={e => setForm({...form, velocity: e.target.value})} required /></div>
            <div><label className="form-label">Object Size</label><select className="form-select" value={form.objectSize} onChange={e => setForm({...form, objectSize: e.target.value})}>{sizes.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div><label className="form-label">Risk Category</label><select className="form-select" value={form.riskCategory} onChange={e => setForm({...form, riskCategory: e.target.value})}>{riskCategories.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
            <div><label className="form-label">Tracking Status</label><select className="form-select" value={form.trackingStatus} onChange={e => setForm({...form, trackingStatus: e.target.value})}>{trackingStatuses.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div><label className="form-label">Country of Origin</label><input className="form-input" value={form.countryOfOrigin} onChange={e => setForm({...form, countryOfOrigin: e.target.value})} required /></div>
          </div>
          <div><label className="form-label">Description</label><textarea className="form-input" rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea></div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">{isEditing ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} message={`Remove "${selected?.objectName}" from tracking?`} />
    </div>
  );
};

export default Debris;
