import React from 'react';

const statusMap = {
  // Satellite statuses
  'Operational': 'badge-success',
  'Degraded': 'badge-warning',
  'Decommissioned': 'badge-gray',
  'Launching': 'badge-info',
  // Mission statuses
  'Scheduled': 'badge-blue',
  'Active': 'badge-success',
  'Completed': 'badge-purple',
  'Delayed': 'badge-warning',
  // Tracking statuses
  'Tracked': 'badge-success',
  'Untracked': 'badge-warning',
  'Lost': 'badge-danger',
  // Communication statuses
  'Online': 'badge-success',
  'Intermittent': 'badge-warning',
  'Offline': 'badge-danger',
  // Alert statuses
  'Resolved': 'badge-success',
  // Risk categories
  'Low': 'badge-success',
  'Medium': 'badge-warning',
  'High': 'badge-danger',
  'Critical': 'badge-danger'
};

const StatusBadge = ({ status }) => {
  const badgeClass = statusMap[status] || 'badge-gray';
  return <span className={`badge ${badgeClass}`}>{status}</span>;
};

export default StatusBadge;
