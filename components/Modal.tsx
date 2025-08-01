
import React, { Fragment } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4 animate-fade-in"
        onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-md border border-slate-700 transform transition-all animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-slate-100">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
        </div>
        <div>{children}</div>
      </div>
       <style>{`
            @keyframes animate-fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .animate-fade-in { animation: animate-fade-in 0.3s ease-out forwards; }

             @keyframes animate-slide-up {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-slide-up { animation: animate-slide-up 0.3s ease-out forwards; }
        `}</style>
    </div>
  );
};
