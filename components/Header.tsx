
import React from 'react';

const FeatherIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
    </svg>
);


export const Header: React.FC = () => {
    return (
        <header className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-900/70 backdrop-blur-sm shrink-0">
            <div className="flex items-center space-x-3">
                <FeatherIcon />
                <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
                    Verse<span className="text-cyan-400">Forge</span>
                </h1>
            </div>
            <div className="text-sm text-slate-400 font-serif italic">
                Your AI Poetry Co-creator
            </div>
        </header>
    );
};
