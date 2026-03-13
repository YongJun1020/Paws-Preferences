import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Cat, Session } from './types';

interface HistoryScreenProps {
  onClose: () => void;
}

export default function HistoryScreen({ onClose }: HistoryScreenProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [previewCat, setPreviewCat] = useState<Cat | null>(null);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('pawsAndPreferencesSessions') || '[]');
      setSessions(data as Session[]);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const clearHistory = () => {
    if (confirm("Are you sure you want to delete all your swiping history? 😿")) {
      localStorage.removeItem('pawsAndPreferencesSessions');
      setSessions([]);
    }
  };

  return (
    <>
      <motion.div
        className="flex flex-col items-center h-full w-full overflow-y-auto p-5 pb-10 bg-linear-to-br from-indigo-300 via-purple-300 to-pink-300 relative"
        style={{ WebkitOverflowScrolling: 'touch' }}
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold backdrop-blur-sm border border-white/30 shadow-md transition-all active:scale-90 z-10"
        >
          ←
        </button>

        <div className="text-center mt-2 mb-6">
          <motion.h2
            className="text-3xl font-black text-white drop-shadow-xl tracking-tight"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            History
          </motion.h2>
        </div>

        {sessions.length > 0 ? (
          <div className="w-full max-w-115 space-y-6">
            {sessions.map((session, index) => (
              <motion.div
                key={session.id}
                className="bg-white/20 backdrop-blur-md rounded-3xl p-5 shadow-xl border-2 border-white/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <div className="flex justify-between items-start mb-4 border-b border-white/20 pb-3">
                  <div>
                    <h3 className="text-white font-black text-lg drop-shadow-sm">
                      {session.date} at {session.time}
                    </h3>
                    <p className="text-white/80 text-xs font-bold uppercase tracking-wider mt-1">
                      Vibe: {session.tag === 'any' ? '🎲 Surprise' : session.tag}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="bg-white/30 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      {session.total} Swipes
                    </span>
                  </div>
                </div>

                {session.liked.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-white text-sm font-black mb-2 flex items-center gap-1.5">
                      <span>😻</span> Loved ({session.liked.length})
                    </h4>
                    <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar pr-2">
                      {session.liked.map((cat: Cat) => (
                        <div
                          key={cat.catId}
                          onClick={() => setPreviewCat(cat)}
                          className="shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 border-pink-400 shadow-md cursor-pointer hover:scale-105 transition-transform"
                        >
                          <img src={cat.url} alt="Liked Cat" className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {session.disliked.length > 0 && (
                  <div>
                    <h4 className="text-white/80 text-sm font-black mb-2 flex items-center gap-1.5">
                      <span>😿</span> Passed ({session.disliked.length})
                    </h4>
                    <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar pr-2">
                      {session.disliked.map((cat: Cat) => (
                        <div
                          key={cat.catId}
                          onClick={() => setPreviewCat(cat)}
                          className="shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 border-indigo-400/50 shadow-sm cursor-pointer hover:scale-105 transition-transform opacity-80 hover:opacity-100"
                        >
                          <img src={cat.url} alt="Disliked Cat" className="w-full h-full object-cover grayscale-30" loading="lazy" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-white/80 mt-10">
            <p className="text-xl font-black mb-2">It&apos;s pretty empty in here.</p>
            <p className="text-sm font-bold">Go swipe some cats to build your history!</p>
          </div>
        )}

        {sessions.length > 0 && (
          <button
            onClick={clearHistory}
            className="mt-8 px-6 py-3 rounded-full text-white/80 font-bold text-sm hover:text-white bg-white/10 hover:bg-white/20 transition-colors shadow-sm"
          >
            Clear All History 🗑️
          </button>
        )}
      </motion.div>

      <AnimatePresence>
        {previewCat && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewCat(null)}
          >
            <motion.div
              className="relative max-w-3xl w-full flex flex-col items-center justify-center pointer-events-none"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewCat(null)}
                className="absolute -top-4 -right-2 md:-right-4 bg-pink-500 hover:bg-pink-400 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-xl z-10 pointer-events-auto"
              >
                <span className="material-icons-round">close</span>
              </button>

              <div className="relative rounded-3xl overflow-hidden border-4 border-white/50 shadow-2xl pointer-events-auto bg-black/50 w-full flex items-center justify-center">
                <img
                  src={previewCat.url}
                  className="max-h-[85vh] w-auto object-contain block"
                  alt="Full preview"
                />
                {previewCat.tags && previewCat.tags.length > 0 && (
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 justify-center">
                    {previewCat.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/20 capitalize"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
