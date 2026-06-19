import React from 'react';
import Modal from './Modal';
import { IoWarning } from 'react-icons/io5';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title = 'Confirm Delete', message = 'Are you sure? This action cannot be undone.' }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="440px">
      <div className="text-center py-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
          <IoWarning className="text-3xl text-rose-400" />
        </div>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
