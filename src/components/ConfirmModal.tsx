import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  onConfirm,
  onCancel,
  isDestructive = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5">
          <div className="flex items-start space-x-3">
            {isDestructive && (
              <div className="flex-shrink-0 text-red-500 mt-0.5">
                <FontAwesomeIcon icon={faExclamationTriangle} size="lg" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{message}</p>
            </div>
          </div>
        </div>
        <div className="flex border-t border-slate-100 divide-x divide-slate-100">
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 text-sm font-medium text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={`flex-1 py-3.5 text-sm font-bold transition-colors ${
              isDestructive
                ? 'text-red-600 hover:bg-red-50 active:bg-red-100'
                : 'text-blue-600 hover:bg-blue-50 active:bg-blue-100'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
