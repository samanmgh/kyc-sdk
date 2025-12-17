import { useEffect, type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <button
      type="button"
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
      onClick={onClose}
      aria-label="Close modal"
    >
      <button
        type="button"
        className="bg-white rounded-lg p-8 max-w-[600px] w-[90%] max-h-[90vh] overflow-auto relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        aria-label="Close modal"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="m-0 text-2xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-2xl cursor-pointer text-gray-500 p-1 leading-none hover:text-gray-900 transition-colors"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        {children}
      </button>
    </button>
  );
}
