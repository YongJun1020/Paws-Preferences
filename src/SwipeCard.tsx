import { useState, forwardRef, useImperativeHandle } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import type { Cat } from './types';

const SWIPE_THRESHOLD = 100;
const SWIPE_VELOCITY = 500;

interface SwipeCardProps {
  cat: Cat;
  onSwipeComplete: (dir: string) => void;
  isTop: boolean;
}

export interface SwipeCardRef {
  triggerSwipe: (dir: string) => void;
}

const SwipeCard = forwardRef<SwipeCardRef, SwipeCardProps>(function SwipeCard({ cat, onSwipeComplete, isTop }, ref) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-25, 0, 25]);
  const likeOpacity = useTransform(x, [0, 80, 160], [0, 0.7, 1]);
  const nopeOpacity = useTransform(x, [-160, -80, 0], [1, 0.7, 0]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [swiping, setSwiping] = useState(false);

  useImperativeHandle(ref, () => ({
    triggerSwipe(dir) {
      if (swiping) return;
      setSwiping(true);
      const flyTo = dir === 'right' ? 600 : -600;
      animate(x, flyTo, {
        duration: 0.35,
        ease: 'easeIn',
        onComplete: () => onSwipeComplete(dir),
      });
    },
  }));

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (swiping) return;
    const { offset, velocity } = info;
    if (
      Math.abs(offset.x) > SWIPE_THRESHOLD ||
      Math.abs(velocity.x) > SWIPE_VELOCITY
    ) {
      setSwiping(true);
      const dir = offset.x > 0 ? 'right' : 'left';
      const flyTo = dir === 'right' ? 600 : -600;
      animate(x, flyTo, {
        duration: 0.3,
        ease: 'easeIn',
        onComplete: () => onSwipeComplete(dir),
      });
    } else {
      animate(x, 0, { type: 'spring', stiffness: 500, damping: 30 });
    }
  };

  if (!isTop) {
    return (
      <div
        className="absolute w-[calc(100%-40px)] max-w-95 max-h-full aspect-3/4 rounded-3xl bg-white shadow-md overflow-hidden border-2 border-pink-200/30"
        style={{ transform: 'scale(0.95) translateY(12px)' }}
      >
        <div className="w-full h-full relative">
          <img
            src={cat.previewUrl}
            alt="Next cat"
            className="w-full h-full object-cover block"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/5" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="absolute w-[calc(100%-40px)] max-w-95 max-h-full aspect-3/4 rounded-3xl overflow-hidden bg-white shadow-2xl cursor-grab touch-none select-none active:cursor-grabbing border-2 border-pink-200/40"
      style={{ x, rotate, zIndex: 10 }}
      drag={swiping ? false : 'x'}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      onDragEnd={handleDragEnd}
      whileTap={swiping ? {} : { scale: 1.02 }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="w-full h-full relative overflow-hidden">
        {!imageLoaded && !imgError && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-pink-50 to-purple-100 animate-[pulse-fade_1.5s_ease-in-out_infinite] gap-3">
            <span className="text-5xl">🐾</span>
            <div className="w-8 h-8 border-3 border-pink-200 border-t-pink-400 rounded-full animate-spin" />
          </div>
        )}

        {imgError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-pink-50 to-purple-100 gap-2">
            <span className="text-7xl">🐱</span>
            <span className="text-pink-400 text-sm font-semibold">Shy kitty hiding!</span>
          </div>
        ) : (
          <img
            src={cat.url}
            alt={`Cat #${cat.id + 1}`}
            className="w-full h-full object-cover pointer-events-none block"
            style={{ display: imageLoaded ? 'block' : 'none' }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImgError(true)}
            draggable={false}
          />
        )}

        <motion.div
          className="absolute top-1/2 left-5 -translate-y-1/2 -rotate-20 px-5 py-2 rounded-2xl border-4 border-green-400 text-green-400 bg-green-400/10 text-2xl font-extrabold tracking-widest uppercase pointer-events-none z-5"
          style={{ opacity: likeOpacity }}
        >
          MEOW!
        </motion.div>

        <motion.div
          className="absolute top-1/2 right-5 -translate-y-1/2 rotate-20 px-5 py-2 rounded-2xl border-4 border-red-400 text-red-400 bg-red-400/10 text-2xl font-extrabold tracking-widest uppercase pointer-events-none z-5"
          style={{ opacity: nopeOpacity }}
        >
          HISS!
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-linear-to-t from-black/50 to-transparent pointer-events-none" />

        {cat.tags && cat.tags.length > 0 && (
          <div className="absolute bottom-12 left-4 right-4 flex flex-wrap gap-1.5 z-2">
            {cat.tags.map((tag: string) => (
              <span
                key={tag}
                className="bg-pink-300/40 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-xs font-bold capitalize"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 text-white font-bold text-lg drop-shadow-md flex items-center gap-1.5">
          <span>🐾</span> Cat #{cat.id + 1}
        </div>
      </div>
    </motion.div>
  );
});

export type { SwipeCardRef };
export default SwipeCard;
