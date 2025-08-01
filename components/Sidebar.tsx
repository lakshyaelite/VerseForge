
import React, { useState } from 'react';
import type { Poem, NewPoemParams, PoemForm, Mood, Theme } from '../types';
import { POETRY_FORMS, MOODS, THEMES, ICONS } from '../constants';
import { IconButton } from './IconButton';

interface SidebarProps {
  poems: Poem[];
  activePoemId: string | null;
  onNewPoem: (params: NewPoemParams) => void;
  onSelectPoem: (id: string) => void;
  onDeletePoem: (id: string) => void;
}

const NewPoemForm: React.FC<{ onNewPoem: (params: NewPoemParams) => void }> = ({ onNewPoem }) => {
  const [form, setForm] = useState<PoemForm>(POETRY_FORMS[0].name);
  const [mood, setMood] = useState<Mood>(MOODS[0]);
  const [theme, setTheme] = useState<Theme>(THEMES[0]);
  const [openingLine, setOpeningLine] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNewPoem({ form, mood, theme, openingLine });
    setOpeningLine('');
  };

  const renderSelect = <T extends string,>(label: string, value: T, setter: React.Dispatch<React.SetStateAction<T>>, options: readonly T[] | {name: T}[] ) => {
    const optionValues = options.map(opt => typeof opt === 'string' ? opt : opt.name);
    return (
        <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">{label}</label>
            <select
                value={value}
                onChange={(e) => setter(e.target.value as T)}
                className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            >
                {optionValues.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );
  };
  
  return (
    <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Craft a New Verse</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            {renderSelect("Form", form, setForm, POETRY_FORMS)}
            {renderSelect("Mood", mood, setMood, MOODS)}
            {renderSelect("Theme", theme, setTheme, THEMES)}
            <div>
                <label htmlFor="opening-line" className="block text-sm font-medium text-slate-400 mb-1">Opening Line (Optional)</label>
                <input
                    id="opening-line"
                    type="text"
                    value={openingLine}
                    onChange={(e) => setOpeningLine(e.target.value)}
                    placeholder="Let your muse speak..."
                    className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                />
            </div>
            <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-105"
            >
                {ICONS.add}
                <span>Start New Poem</span>
            </button>
        </form>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ poems, activePoemId, onNewPoem, onSelectPoem, onDeletePoem }) => {
  return (
    <aside className="w-80 lg:w-96 bg-slate-800/50 flex flex-col shrink-0 border-r border-slate-700/50">
      <NewPoemForm onNewPoem={onNewPoem} />
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-lg font-semibold text-slate-100 mb-3">Saved Poems</h3>
        {poems.length > 0 ? (
          <ul className="space-y-2">
            {poems.map(poem => (
              <li key={poem.id}>
                <button
                  onClick={() => onSelectPoem(poem.id)}
                  className={`w-full text-left p-3 rounded-md transition-colors duration-200 group ${
                    activePoemId === poem.id ? 'bg-cyan-900/50' : 'hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                        <p className={`font-semibold truncate ${activePoemId === poem.id ? 'text-cyan-300' : 'text-slate-200'}`}>{poem.title}</p>
                        <p className="text-xs text-slate-400 font-serif">{poem.form} &middot; {new Date(poem.updatedAt).toLocaleDateString()}</p>
                    </div>
                    <IconButton 
                        icon={ICONS.trash} 
                        onClick={(e) => { e.stopPropagation(); onDeletePoem(poem.id); }} 
                        className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        tooltip="Delete Poem"
                    />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-slate-500 py-10">
            <p className="font-serif italic">No poems yet.</p>
            <p className="text-sm">Create one above to begin.</p>
          </div>
        )}
      </div>
    </aside>
  );
};
