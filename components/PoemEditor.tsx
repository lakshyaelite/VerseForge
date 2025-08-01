
import React, { useState } from 'react';
import type { Poem } from '../types';
import { ICONS } from '../constants';
import { IconButton } from './IconButton';
import { Modal } from './Modal';

interface PoemEditorProps {
  poem: Poem;
  onUpdate: (updatedPoem: Partial<Poem>) => void;
  onForge: (surprise?: boolean) => void;
  onAcceptSuggestion: () => void;
  onModifySuggestion: () => void;
  isLoading: boolean;
}

export const PoemEditor: React.FC<PoemEditorProps> = ({ poem, onUpdate, onForge, onAcceptSuggestion, onModifySuggestion, isLoading }) => {
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onUpdate({ content: e.target.value });
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ title: e.target.value });
    };

    const copyToClipboard = () => {
        const poemText = `"${poem.title}"\n\nA ${poem.form} about ${poem.theme} with a ${poem.mood} mood.\n\n${poem.content}\n\n- Crafted with VerseForge`;
        navigator.clipboard.writeText(poemText).then(() => {
            alert('Poem copied to clipboard!');
            setIsShareModalOpen(false);
        });
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-700">
                <div>
                     <input
                        type="text"
                        value={poem.title}
                        onChange={handleTitleChange}
                        className="bg-transparent text-2xl font-bold text-slate-100 w-full focus:outline-none focus:bg-slate-800/50 rounded px-2 py-1"
                        placeholder="Untitled Poem"
                    />
                    <div className="flex items-center space-x-2 text-sm text-slate-400 mt-1 px-2">
                        <span className="font-semibold">{poem.form}</span>
                        <span>&bull;</span>
                        <span>{poem.mood}</span>
                        <span>&bull;</span>
                        <span>{poem.theme}</span>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <IconButton icon={ICONS.share} onClick={() => setIsShareModalOpen(true)} tooltip="Share" />
                </div>
            </div>

            <div className="flex-1 flex flex-col relative">
                <textarea
                    value={poem.content}
                    onChange={handleContentChange}
                    placeholder="Begin your verse here..."
                    className="w-full h-full flex-1 bg-transparent p-4 text-lg font-serif leading-loose resize-none focus:outline-none text-slate-200 placeholder-slate-500"
                />

                {poem.aiSuggestion && !isLoading && (
                    <div className="bg-slate-800/80 backdrop-blur-sm border border-cyan-700/50 rounded-lg p-4 my-4 animate-fade-in">
                        <p className="text-sm font-bold text-cyan-300 mb-2">VerseForge Suggests:</p>
                        <p className="font-serif italic text-lg text-cyan-100/90 whitespace-pre-wrap">{poem.aiSuggestion}</p>
                        <div className="flex items-center justify-end space-x-2 mt-4">
                            <IconButton icon={ICONS.check} text="Accept" onClick={onAcceptSuggestion} className="bg-green-600/20 hover:bg-green-600/40 text-green-300" />
                            <IconButton icon={ICONS.pencil} text="Modify" onClick={onModifySuggestion} className="bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-300"/>
                            <IconButton icon={ICONS.retry} text="Retry" onClick={() => onForge()} className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-300"/>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-end space-x-3 p-4 bg-slate-800/30 rounded-t-lg mt-auto shrink-0">
                <button
                    onClick={() => onForge(true)}
                    disabled={isLoading}
                    className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 text-purple-200 bg-purple-600/30 hover:bg-purple-600/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:text-slate-400"
                >
                    {ICONS.sparkles}
                    <span>Surprise Me</span>
                </button>
                <button
                    onClick={() => onForge(false)}
                    disabled={isLoading}
                    className="flex items-center justify-center space-x-2 px-6 py-2 font-bold rounded-md transition-all duration-200 transform hover:scale-105 text-white bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Forging...' : 'Forge Next Line'}
                </button>
            </div>
            
            <Modal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} title="Share Your Poem">
                <div className="p-4">
                    <p className="text-slate-400 mb-4">A copy of your poem and its details will be copied to your clipboard.</p>
                    <div className="bg-slate-800 p-4 rounded-md border border-slate-700 max-h-60 overflow-y-auto font-serif text-sm">
                       <p className="font-sans font-bold text-base mb-2">"{poem.title}"</p>
                       <p className="whitespace-pre-wrap">{poem.content}</p>
                    </div>
                    <div className="mt-6 flex justify-end">
                         <button onClick={copyToClipboard} className="bg-cyan-600 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-500 transition-colors">Copy to Clipboard</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
