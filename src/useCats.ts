import { useState, useCallback, useEffect } from 'react';
import type { Cat } from './types';

async function fetchCats(count: number, tag: string): Promise<Cat[]> {
  let url = `https://cataas.com/api/cats?limit=${count}`;
  if (tag && tag !== 'any') {
    url += `&tags=${encodeURIComponent(tag)}`;
  }

  try {
    const res = await fetch(url);
    let data = await res.json();

    if (data.length < count) {
      const remaining = count - data.length;
      const fallbackUrl = `https://cataas.com/api/cats?limit=${remaining}`;
      const fallbackRes = await fetch(fallbackUrl);
      const fallbackData = await fallbackRes.json();
      data = [...data, ...fallbackData];
    }

    const seenIds = new Set<string>();
    const cats: Cat[] = [];

    for (const cat of data) {
      const catId = cat.id;
      if (!catId) continue;
      if (seenIds.has(catId)) continue;
      seenIds.add(catId);

      cats.push({
        id: cats.length,
        catId: catId,
        tags: cat.tags || [],
        url: `https://cataas.com/cat/${catId}`,
        previewUrl: `https://cataas.com/cat/${catId}`,
      });
      if (cats.length >= count) break;
    }

    return cats;
  } catch (error) {
    console.error("Failed to fetch cats:", error);
    return [];
  }
}

export function useCats() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [forceFinish, setForceFinish] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<Cat[]>([]);
  const [disliked, setDisliked] = useState<Cat[]>([]);
  const [catCount, setCatCount] = useState(15);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState('any');

  useEffect(() => {
    fetch('https://cataas.com/api/tags')
      .then(res => res.json())
      .then((data: unknown) => {
        const validTags = (data as string[])
          .filter((t): t is string => typeof t === 'string' && t.trim().length > 1 && !t.includes(' '))
          .sort((a, b) => a.localeCompare(b));
        setTags(validTags);
      })
      .catch(err => console.error("Could not fetch tags", err));
  }, []);

  const start = useCallback((count: number, tag: string) => {
    setCatCount(count);
    setSelectedTag(tag);
    setStarted(true);
    setLoading(true);
    setForceFinish(false);
    setCurrentIndex(0);
    setLiked([]);
    setDisliked([]);
    fetchCats(count, tag)
      .then((catData) => {
        setCats(catData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const isFinished = started && !loading && (currentIndex >= cats.length || forceFinish);
  const currentCat = cats[currentIndex] || null;
  const nextCat = cats[currentIndex + 1] || null;

  const recordSwipe = useCallback((dir: string) => {
    if (currentIndex >= cats.length) return;
    const cat = cats[currentIndex];
    if (!cat) return;
    if (dir === 'right') {
      setLiked((prev) => [...prev, cat]);
    } else {
      setDisliked((prev) => [...prev, cat]);
    }
    setCurrentIndex((prev) => prev + 1);
  }, [cats, currentIndex]);

  const undoSwipe = useCallback(() => {
    if (currentIndex <= 0) return;
    const prevIndex = currentIndex - 1;
    const prevCat = cats[prevIndex];
    if (!prevCat) return;
    
    setLiked(prev => prev.filter(c => c.id !== prevCat.id));
    setDisliked(prev => prev.filter(c => c.id !== prevCat.id));
    
    setCurrentIndex(prevIndex);
    setForceFinish(false);
  }, [currentIndex, cats]);

  const endEarly = useCallback(() => {
    setForceFinish(true);
  }, []);

  const restart = useCallback(() => {
    if (liked.length > 0 || disliked.length > 0) {
      try {
        const hist = JSON.parse(localStorage.getItem('pawsAndPreferencesSessions') || '[]');
        const newSession = {
          id: Date.now(),
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          liked: liked,
          disliked: disliked,
          total: liked.length + disliked.length,
          tag: selectedTag
        };

        hist.unshift(newSession);
        if (hist.length > 10) hist.pop();

        localStorage.setItem('pawsAndPreferencesSessions', JSON.stringify(hist));
      } catch (e) {
        console.error("Failed to save history", e);
      }
    }

    setStarted(false);
    setLoading(false);
    setForceFinish(false);
    setCats([]);
    setCurrentIndex(0);
    setLiked([]);
    setDisliked([]);
  }, [liked, disliked, selectedTag]);

  return {
    cats,
    loading,
    started,
    currentIndex,
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
    catCount,
    total: cats.length,
    availableTags: tags,
    selectedTag,
  };
}
