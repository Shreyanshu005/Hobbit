import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { HobbyButton } from './atoms/HobbyButton';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: 'danger' | 'warning';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Delete',
  variant = 'danger'
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-[#fffbf4] w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl border border-black/5"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-slate-600 font-medium text-lg leading-relaxed mb-8">
                {message}
              </p>

              <div className="flex justify-end gap-3 mt-2">
                <button
                  onClick={onClose}
                  className="py-2 px-4 rounded-xl font-bold text-slate-500 hover:bg-black/5 transition-colors text-sm"
                >
                  Cancel
                </button>
                <HobbyButton
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="py-2 px-6 rounded-xl bg-rose-500 text-white border-rose-500 hover:bg-rose-600 shadow-rose-100 text-sm h-auto"
                >
                  {confirmLabel}
                </HobbyButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
