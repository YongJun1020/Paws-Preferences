import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Cat } from './types';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1 },
};

function getAllTags(cats: Cat[]) {
  const tagSet = new Set<string>();
  for (const cat of cats) {
    if (cat.tags && cat.tags.length > 0) {
      cat.tags.forEach((t: string) => {
        if (t && t.trim().length > 0) {
          tagSet.add(t);
        }
      });
    }
  }
  return Array.from(tagSet).sort((a: string, b: string) => a.localeCompare(b));
}

interface SummaryProps {
  liked: Cat[];
  disliked: Cat[];
  onRestart: () => void;
}

export default function Summary({ liked, disliked, onRestart }: SummaryProps) {
  const total = liked.length + disliked.length;
  const [viewMode, setViewMode] = useState('liked');
  const activeList = viewMode === 'liked' ? liked : disliked;
  
  const allTags = useMemo(() => getAllTags(activeList), [activeList]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [previewCat, setPreviewCat] = useState<Cat | null>(null);

  const filteredCats = useMemo(() => {
    if (!activeTag) return activeList;
    return activeList.filter(
      (cat: Cat) => cat.tags && cat.tags.includes(activeTag)
    );
  }, [activeList, activeTag]);

  const handleViewChange = (mode: string) => {
    setViewMode(mode);
    setActiveTag(null);
  };

  return (
    <>
      <motion.div
        className="flex flex-col items-center h-full w-full overflow-y-auto p-5 pb-10"
        style={{ WebkitOverflowScrolling: 'touch' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mt-4 mb-6 relative">
          <motion.div
            className="absolute -top-6 -right-6 text-4xl rotate-12 drop-shadow-md"
            animate={{ rotate: [12, 20, 12] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            ✨
          </motion.div>
          <motion.h2
            className="text-4xl font-black text-white drop-shadow-xl tracking-tighter"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Purr-fect! 🐾
          </motion.h2>
        </div>

        <motion.div
          className="flex gap-4 my-4 mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <div className="bg-white/20 backdrop-blur-md rounded-3xl px-6 py-5 text-center border-2 border-white/40 shadow-xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-5xl opacity-20 group-hover:scale-110 transition-transform">😻</div>
            <div className="text-4xl font-black text-white relative z-10">{liked.length}</div>
            <div className="text-[0.65rem] text-white font-extrabold uppercase tracking-widest mt-1 relative z-10">Loved</div>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-3xl px-6 py-5 text-center border-2 border-white/40 shadow-xl relative overflow-hidden group">
            <div className="absolute -left-4 -bottom-4 text-5xl opacity-20 group-hover:scale-110 transition-transform">😿</div>
            <div className="text-4xl font-black text-white relative z-10">{disliked.length}</div>
            <div className="text-[0.65rem] text-white font-extrabold uppercase tracking-widest mt-1 relative z-10">Passed</div>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-3xl px-6 py-5 text-center border-2 border-white/40 shadow-xl relative overflow-hidden group">
            <div className="absolute -right-2 -bottom-4 text-5xl opacity-20 group-hover:scale-110 transition-transform">🐟</div>
            <div className="text-4xl font-black text-white relative z-10">{total}</div>
            <div className="text-[0.65rem] text-white font-extrabold uppercase tracking-widest mt-1 relative z-10">Total</div>
          </div>
        </motion.div>

        <motion.div
          className="flex bg-white/20 p-1.5 rounded-full mb-6 w-full max-w-105 shadow-inner border border-white/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <button
            onClick={() => handleViewChange('liked')}
            className={`flex-1 py-2.5 rounded-full text-sm font-black transition-all ${
              viewMode === 'liked' 
                ? 'bg-pink-500 text-white shadow-md' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            😻 Loved ({liked.length})
          </button>
          <button
            onClick={() => handleViewChange('disliked')}
            className={`flex-1 py-2.5 rounded-full text-sm font-black transition-all ${
              viewMode === 'disliked' 
                ? 'bg-indigo-500 text-white shadow-md' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            😿 Passed ({disliked.length})
          </button>
        </motion.div>

        {activeList.length > 0 ? (
          <>
            {allTags.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-2 justify-center mb-6 max-w-105 w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <button
                  onClick={() => setActiveTag(null)}
                  className={`px-4 py-2 rounded-full text-xs font-black capitalize transition-all duration-200 border-2 shadow-md cursor-pointer ${
                    activeTag === null
                      ? viewMode === 'liked' ? 'bg-white text-pink-600 border-white scale-105' : 'bg-white text-indigo-600 border-white scale-105'
                      : 'bg-white/20 text-white border-transparent hover:bg-white/30 hover:border-white/30'
                  }`}
                >
                  All ({activeList.length})
                </button>
                {allTags.map((tag: string) => {
                  const count = activeList.filter(
                    (c: Cat) => c.tags && c.tags.includes(tag)
                  ).length;
                  return (
                    <button
                      key={tag}
                      onClick={() =>
                        setActiveTag(activeTag === tag ? null : tag)
                      }
                      className={`px-4 py-2 rounded-full text-xs font-black capitalize transition-all duration-200 border-2 shadow-md cursor-pointer ${
                        activeTag === tag
                          ? viewMode === 'liked' ? 'bg-white text-pink-600 border-white scale-105' : 'bg-white text-indigo-600 border-white scale-105'
                          : 'bg-white/20 text-white border-transparent hover:bg-white/30 hover:border-white/30'
                      }`}
                    >
                      {tag} ({count})
                    </button>
                  );
                })}
              </motion.div>
            )}

            <motion.div
              className="grid grid-cols-2 gap-4 w-full max-w-105 px-2"
              variants={container}
              initial="hidden"
              animate="show"
              key={activeTag || 'all'}
            >
              {filteredCats.map((cat: Cat) => (
                <motion.div
                  key={cat.id}
                  className="rounded-3xl overflow-hidden aspect-4/5 shadow-2xl relative group border-4 border-white/40 bg-white/5 cursor-pointer hover:border-pink-300"
                  variants={item}
                  onClick={() => setPreviewCat(cat)}
                  whileHover={{ scale: 1.02, rotate: Math.random() > 0.5 ? 2 : -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={cat.url}
                    alt={`${viewMode === 'liked' ? 'Liked' : 'Passed'} cat #${cat.id + 1}`}
                    className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                    <span className="bg-white/80 rounded-full p-2 text-xl shadow-lg backdrop-blur-sm">🔍</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {filteredCats.length === 0 && activeTag && (
              <motion.div
                className="bg-white/20 rounded-3xl p-6 mt-4 text-center border-2 border-white/30 max-w-105 w-full mx-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <p className="text-4xl mb-2">🙀</p>
                <p className="text-white font-bold">
                  No {viewMode === 'liked' ? 'adopted' : 'passed'} cats with tag &quot;{activeTag}&quot;
                </p>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            className="text-center text-white bg-white/20 rounded-3xl p-8 border-2 border-white/30 shadow-xl max-w-90 w-full mx-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-6xl mb-4 drop-shadow-md">🙀</p>
            <p className="text-xl font-black mb-2">Nothing here!</p>
            <p className="text-sm font-semibold opacity-90 leading-relaxed">
              You didn&apos;t {viewMode === 'liked' ? 'adopt' : 'pass'} any cats this time.
            </p>
          </motion.div>
        )}

        <div className="flex flex-wrap justify-center gap-4">
          <motion.button
            className="mt-10 px-8 py-4 rounded-full text-white font-black text-lg tracking-wide shadow-2xl border-b-4 border-pink-700 bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 active:border-b-0 active:translate-y-1 transition-all"
            onClick={onRestart}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            SWIPE MORE
          </motion.button>
        </div>
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
              className="relative max-w-3xl w-full max-h-[90vh] flex flex-col items-center justify-center pointer-events-none"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewCat(null)}
                className="absolute -top-4 -right-2 md:-right-4 bg-pink-500 hover:bg-pink-400 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-xl z-10 pointer-events-auto transition-transform active:scale-90"
              >
                <span className="material-icons-round">close</span>
              </button>

              <div className="pointer-events-auto">
                <img
                  src={previewCat.url}
                  alt="Full preview"
                  className="max-h-[70vh] w-auto object-contain block rounded-2xl border-4 border-white/50 shadow-2xl"
                />

                {previewCat.tags && previewCat.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {previewCat.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/30 capitalize"
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
