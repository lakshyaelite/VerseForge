
import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  text?: string;
  tooltip?: string;
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ icon, text, tooltip, className = '', ...props }) => {
  return (
    <button
      title={tooltip}
      className={`flex items-center justify-center space-x-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed group relative ${className || 'text-slate-400 hover:bg-slate-700 hover:text-slate-100'}`}
      {...props}
    >
      {icon}
      {text && <span>{text}</span>}
    </button>
  );
};
