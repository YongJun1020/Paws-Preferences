import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StartScreenProps {
  onStart: (count: number, tag: string) => void;
  availableTags: string[];
  onViewHistory: () => void;
}

export default function StartScreen({ onStart, availableTags, onViewHistory }: StartScreenProps) {
  const [count, setCount] = useState(15);
  const [tag, setTag] = useState('any');
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTags = availableTags.filter((t: string) => 
    t.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full w-full p-6 text-center overflow-y-auto"
      style={{ WebkitOverflowScrolling: 'touch' }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      <div className="mb-6 md:mb-8 mt-auto pt-4 md:pt-0">
        <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-xl mb-3 md:mb-4 tracking-tighter">
          Paws & Preferences
        </h1>
        <p className="text-white/90 text-base md:text-lg font-bold">
          Swipe right for purr-fection, left for &quot;hiss-terically not!&quot;
        </p>
      </div>

      <div className="bg-white/20 backdrop-blur-md rounded-3xl p-5 md:p-6 shadow-2xl border-2 border-white/30 max-w-sm w-full mb-auto pb-6">
        <div className="mb-6 text-left">
          <label htmlFor="count" className="block text-white font-extrabold text-sm uppercase tracking-widest mb-2">
            How many cats? ({count})
          </label>
          <input
            id="count"
            type="range"
            min="10"
            max="20"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full accent-pink-500 h-2 bg-white/40 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-white/70 text-xs font-bold mt-1">
            <span>10</span>
            <span>20</span>
          </div>
        </div>

        <div className="mb-6 text-left" ref={dropdownRef}>
          <label className="block text-white font-extrabold text-sm uppercase tracking-widest mb-2">
            Search a Vibe (Tag)
          </label>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full bg-white/80 text-purple-900 rounded-xl px-4 py-3 font-bold text-left border-2 border-transparent focus:border-pink-400 transition-all shadow-inner flex justify-between items-center"
            >
              <span className="truncate">
                {tag === 'any' ? '🎲 Surprise Me (Any Tag)' : tag}
              </span>
              <span className="text-purple-900/50">▼</span>
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border-2 border-pink-200 flex flex-col max-h-64"
                >
                  <div className="p-3 border-b border-gray-100 bg-gray-50 sticky top-0">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Type to search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                    />
                  </div>
                  <div className="overflow-y-auto flex-1 p-2 custom-scrollbar">
                    {('surprise me any tag'.includes(searchQuery.toLowerCase())) && (
                      <button
                        onClick={() => { setTag('any'); setDropdownOpen(false); setSearchQuery(''); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                          tag === 'any' ? 'bg-pink-100 text-pink-700' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        🎲 Surprise Me (Any Tag)
                      </button>
                    )}
                    {filteredTags.length === 0 ? (
                      <div className="px-3 py-4 text-center text-sm text-gray-400 font-semibold">
                        No tags found
                      </div>
                    ) : (
                      filteredTags.map((t: string) => (
                        <button
                          key={t}
                          onClick={() => { setTag(t); setDropdownOpen(false); setSearchQuery(''); }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                            tag === t ? 'bg-pink-100 text-pink-700' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {t}
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {tag !== 'any' && (
            <p className="text-white/80 text-xs font-semibold mt-2 leading-tight bg-black/10 p-2 rounded-lg backdrop-blur-sm">
              Note: If there aren&apos;t enough cats for &quot;{tag}&quot;, we&apos;ll magically fill the rest with random cuties! 🐾
            </p>
          )}
        </div>

        <motion.button
          onClick={() => onStart(count, tag)}
          className="w-full py-4 rounded-2xl text-white font-black text-lg tracking-wide shadow-lg border-b-4 border-pink-700 bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 active:border-b-0 active:translate-y-1 transition-all mb-4"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          START SWIPING
        </motion.button>

        <button 
          onClick={onViewHistory}
          className="text-white/80 text-sm font-bold hover:text-white underline decoration-white/30 hover:decoration-white transition-all"
        >
          View All-Time History
        </button>
      </div>
    </motion.div>
  );
}
