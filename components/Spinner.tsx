
import React from 'react';

export const Spinner: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xl font-serif italic text-cyan-200">Forging inspiration...</p>
            </div>
        </div>
    );
};
