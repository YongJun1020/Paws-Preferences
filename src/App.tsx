import { useRef, useState } from 'react';
import { useCats } from './useCats';
import SwipeCard from './SwipeCard';
import type { SwipeCardRef } from './SwipeCard';
import Summary from './Summary';
import StartScreen from './StartScreen';
import HistoryScreen from './HistoryScreen';
import { AnimatePresence } from 'framer-motion';

function App() {
  const {
    loading,
    started,
    currentCat,
    nextCat,
    liked,
    disliked,
    isFinished,
    recordSwipe,
    undoSwipe,
    endEarly,
    start,
    restart,
    currentIndex,
    total,
    availableTags,
  } = useCats();

  const [showHistory, setShowHistory] = useState(false);
  const cardRef = useRef<SwipeCardRef>(null);

  const handleButtonSwipe = (dir: string) => {
    if (cardRef.current) {
      cardRef.current.triggerSwipe(dir);
    }
  };

  if (showHistory) {
    return (
      <div className="flex flex-col items-center h-full w-full relative overflow-hidden">
        <HistoryScreen onClose={() => setShowHistory(false)} />
      </div>
    );
  }

  if (!started) {
    return (
      <div className="flex flex-col items-center h-full w-full relative overflow-hidden bg-linear-to-br from-pink-300 via-purple-300 to-indigo-400">
        <StartScreen 
          onStart={start} 
          availableTags={availableTags} 
          onViewHistory={() => setShowHistory(true)} 
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center h-full w-full relative overflow-hidden bg-linear-to-br from-pink-300 via-purple-300 to-indigo-400">
        <div className="flex flex-col items-center justify-center h-full gap-5">
          <div className="w-16 h-16 border-8 border-white/30 border-t-pink-500 rounded-full animate-spin drop-shadow-lg" />
          <p className="text-white text-xl font-extrabold tracking-widest drop-shadow-md">
            Summoning Cats...
          </p>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center h-full w-full relative overflow-hidden bg-linear-to-br from-pink-300 via-purple-300 to-indigo-400">
        <Summary liked={liked} disliked={disliked} onRestart={restart} onUndo={undoSwipe} />
      </div>
    );
  }

  const progress = (currentIndex / total) * 100;

  return (
    <div className="flex flex-col items-center h-full w-full relative overflow-y-auto bg-linear-to-br from-pink-300 via-purple-300 to-indigo-400">
      <button 
        onClick={endEarly}
        className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full text-xs font-extrabold backdrop-blur-md border border-white/30 shadow-sm transition-all active:scale-95 z-50 uppercase tracking-wider"
      >
        Finish Now
      </button>

      <div className="pt-14 px-5 pb-2 text-center z-10 w-full shrink-0">
        <h1 className="text-2xl md:text-3xl font-black text-white drop-shadow-lg tracking-tight">
          Paws & Preferences
        </h1>
        <p className="text-xs md:text-sm text-white/90 mt-1 font-bold tracking-wide">
          Find your purr-fect match
        </p>
      </div>

      <div className="w-full max-w-100 px-6 py-2 mx-auto shrink-0">
        <div className="h-2 md:h-3 bg-white/30 rounded-full overflow-hidden shadow-inner border border-white/40">
          <div
            className="h-full rounded-full transition-all duration-500 ease-in-out"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #fbc2eb 0%, #a6c1ee 100%)',
            }}
          />
        </div>
        <div className="text-center text-[0.65rem] md:text-xs text-white mt-1.5 font-extrabold tracking-widest">
          CAT {currentIndex + 1} OF {total}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-105 px-5 py-2 relative min-h-75">
        {nextCat && (
          <SwipeCard
            key={`bg-${nextCat.id}`}
            cat={nextCat}
            onSwipeComplete={() => {}}
            isTop={false}
          />
        )}

        <AnimatePresence mode="wait">
          {currentCat && (
            <SwipeCard
              ref={cardRef}
              key={currentCat.id}
              cat={currentCat}
              onSwipeComplete={recordSwipe}
              isTop={true}
            />
          )}
        </AnimatePresence>

        <div className="absolute -bottom-2 md:-bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-[0.65rem] md:text-xs font-bold whitespace-nowrap bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20 shadow-sm z-50 pointer-events-none">
          Swipe or use buttons below
        </div>
      </div>

      <div className="flex gap-4 md:gap-6 py-4 md:py-6 pb-6 md:pb-10 z-10 items-center justify-center shrink-0 mt-4 md:mt-0">
        <button
          className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white flex items-center justify-center text-3xl md:text-4xl cursor-pointer transition-transform duration-200 shadow-2xl bg-linear-to-br from-white to-gray-100 text-rose-500 hover:scale-110 active:scale-95 group"
          onClick={() => handleButtonSwipe('left')}
          aria-label="Dislike"
        >
          <span className="group-hover:rotate-12 transition-transform duration-300 inline-block">
            😿
          </span>
        </button>

        <button
          onClick={undoSwipe}
          disabled={currentIndex === 0}
          className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-4 flex items-center justify-center shadow-xl transition-all ${
            currentIndex === 0 
              ? 'bg-white/40 border-white/50 opacity-60 cursor-not-allowed grayscale' 
              : 'bg-linear-to-br from-white to-gray-100 border-white text-amber-500 hover:scale-110 active:scale-95 cursor-pointer'
          }`}
          aria-label="Undo"
          title="Undo last swipe"
        >
          <span className="material-icons-round text-2xl md:text-3xl">undo</span>
        </button>

        <button
          className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white flex items-center justify-center text-3xl md:text-4xl cursor-pointer transition-transform duration-200 shadow-2xl bg-linear-to-br from-white to-gray-100 text-emerald-500 hover:scale-110 active:scale-95 group"
          onClick={() => handleButtonSwipe('right')}
          aria-label="Like"
        >
          <span className="group-hover:-rotate-12 transition-transform duration-300 inline-block drop-shadow-sm">
            😻
          </span>
        </button>
      </div>
    </div>
  );
}

export default App;
