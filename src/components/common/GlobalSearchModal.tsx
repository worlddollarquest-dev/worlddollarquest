import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Wrench, Package, BookOpen, Briefcase, FileText, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const { searchGlobal } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim() ? searchGlobal(query) : [];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onNavigate(window.location.pathname); // Or open search
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNavigate]);

  const handleSelect = (url: string) => {
    onNavigate(url);
    onClose();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'tool':
        return <Wrench className="w-4 h-4 text-teal-400" />;
      case 'product':
        return <Package className="w-4 h-4 text-indigo-400" />;
      case 'article':
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case 'service':
        return <Briefcase className="w-4 h-4 text-blue-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 border-b border-slate-800">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search free tools, digital products, articles, guides..."
                className="w-full px-3 py-4 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-base"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-slate-400 hover:text-white rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs text-slate-400 bg-slate-800 border border-slate-700 rounded ml-2">
                ESC
              </kbd>
            </div>

            {/* Results Container */}
            <div className="max-h-96 overflow-y-auto p-3">
              {query.trim() === '' ? (
                <div className="p-6 text-center text-slate-400 text-sm">
                  <p className="font-medium text-slate-300">Quick Search</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Try searching for &quot;prompt generator&quot;, &quot;freelance&quot;, &quot;notion&quot;, or &quot;rate calculator&quot;.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {['AI Prompt Generator', 'Freelance Playbook', 'Word Counter', 'Notion OS'].map(
                      (tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setQuery(tag)}
                          className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700/50"
                        >
                          {tag}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item.url)}
                      className="w-full flex items-center justify-between p-3 rounded-xl text-left hover:bg-slate-800/80 transition-colors group"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-slate-700 text-slate-300 shrink-0">
                          {getIcon(item.type)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-200 text-sm truncate">
                              {item.title}
                            </p>
                            {item.badge && (
                              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors ml-2 shrink-0" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm text-slate-300 font-medium">No matches found for &quot;{query}&quot;</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Try searching with broader terms or check our catalog pages.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
              <span>World Dollar Quest Search Index</span>
              <span>{results.length} result(s)</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
