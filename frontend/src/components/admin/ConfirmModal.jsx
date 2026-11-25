import { useEffect } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Delete',
  isProcessing = false,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !isProcessing) {
        onCancel();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, isProcessing, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={() => !isProcessing && onCancel()}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#171717] p-6 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e50914]/35 bg-[#e50914]/15 text-[#ff303b]">
            <AlertTriangle size={20} />
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            aria-label="Close confirmation dialog"
            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <h3
          id="confirm-modal-title"
          className="text-lg font-semibold text-white"
        >
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">{message}</p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 rounded-lg bg-[#e50914] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#b20710] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isProcessing && <Loader2 size={15} className="animate-spin" />}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
