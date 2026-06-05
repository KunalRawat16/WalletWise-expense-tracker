import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div 
        className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 transform transition-all animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        <div className="p-6">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-500 p-3 rounded-full">
              <AlertTriangle className="h-8 w-8" />
            </div>
          </div>
          
          <h3 id="delete-modal-title" className="text-lg font-bold text-slate-800 dark:text-slate-100 text-center mb-2">
            Delete Expense?
          </h3>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
            Are you sure you want to delete <span className="font-bold text-slate-700 dark:text-slate-300">"{itemName}"</span>? This action cannot be undone.
          </p>

          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/20 transition-all text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
