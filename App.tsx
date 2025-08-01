
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { PoemEditor } from './components/PoemEditor';
import { Header } from './components/Header';
import { Spinner } from './components/Spinner';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generatePoemContinuation } from './services/geminiService';
import type { Poem, PoemForm, NewPoemParams } from './types';

const App: React.FC = () => {
  const [poems, setPoems] = useLocalStorage<Poem[]>('verseforge-poems', []);
  const [activePoemId, setActivePoemId] = useLocalStorage<string | null>('verseforge-active-poem', null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const activePoem = poems.find(p => p.id === activePoemId) || null;

  const handleCreateNewPoem = (params: NewPoemParams) => {
    const newPoem: Poem = {
      id: `poem_${Date.now()}`,
      title: params.openingLine.substring(0, 30) || `${params.theme} - ${params.mood}`,
      content: params.openingLine,
      form: params.form,
      mood: params.mood,
      theme: params.theme,
      aiSuggestion: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPoems(prev => [newPoem, ...prev]);
    setActivePoemId(newPoem.id);
    setError(null);
  };

  const handleUpdatePoem = (updatedPoem: Partial<Poem>) => {
    setPoems(prev => 
      prev.map(p => 
        p.id === activePoemId ? { ...p, ...updatedPoem, updatedAt: new Date().toISOString() } : p
      )
    );
  };
  
  const handleDeletePoem = (id: string) => {
    setPoems(prev => prev.filter(p => p.id !== id));
    if (activePoemId === id) {
      setActivePoemId(null);
    }
  };

  const handleSelectPoem = (id: string) => {
    setActivePoemId(id);
    setError(null);
  };
  
  const handleForge = useCallback(async (surprise = false) => {
    if (!activePoem) return;

    setIsLoading(true);
    setError(null);
    handleUpdatePoem({ aiSuggestion: null });

    try {
      const suggestion = await generatePoemContinuation(activePoem, surprise);
      handleUpdatePoem({ aiSuggestion: suggestion });
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [activePoem, handleUpdatePoem]);


  const handleAcceptSuggestion = () => {
    if (!activePoem || !activePoem.aiSuggestion) return;
    const newContent = `${activePoem.content}\n${activePoem.aiSuggestion}`.trim();
    handleUpdatePoem({ content: newContent, aiSuggestion: null });
  };
  
  const handleModifySuggestion = () => {
    if (!activePoem || !activePoem.aiSuggestion) return;
    const newContent = `${activePoem.content}\n${activePoem.aiSuggestion}`.trim();
    handleUpdatePoem({ content: newContent, aiSuggestion: null });
  };


  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-300 font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          poems={poems}
          activePoemId={activePoemId}
          onNewPoem={handleCreateNewPoem}
          onSelectPoem={handleSelectPoem}
          onDeletePoem={handleDeletePoem}
        />
        <main className="flex-1 flex flex-col p-6 overflow-y-auto">
          {isLoading && <Spinner />}
          {error && <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg mb-4">{error}</div>}
          
          {activePoem ? (
            <PoemEditor 
              key={activePoem.id}
              poem={activePoem}
              onUpdate={handleUpdatePoem}
              onForge={handleForge}
              onAcceptSuggestion={handleAcceptSuggestion}
              onModifySuggestion={handleModifySuggestion}
              isLoading={isLoading}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-slate-500">
                <p className="text-2xl font-serif">Welcome to VerseForge</p>
                <p className="mt-2">Select a poem from the sidebar or create a new one to begin.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
