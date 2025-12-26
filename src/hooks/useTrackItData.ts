import { useState, useEffect, useCallback } from 'react';
import type { AppState, Source } from '../types';
import { loadState, saveState } from '../services/storage';
import { fetchReleases } from '../services/github';

export const useTrackItData = () => {
  const [state, setState] = useState<AppState>(loadState);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Persist state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  const addSource = useCallback(async (owner: string, repo: string) => {
    const id = `${owner}/${repo}`;
    if (state.sources.some(s => s.id === id)) return; // Already exists

    const newSource: Source = { id, owner, repo, lastChecked: new Date().toISOString() };
    
    // Optimistic update
    setState(prev => ({ ...prev, sources: [...prev.sources, newSource] }));

    // Fetch initial releases
    const releases = await fetchReleases(owner, repo);
    setState(prev => ({
      ...prev,
      releases: [...prev.releases, ...releases].sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
    }));
  }, [state.sources]);

  const removeSource = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      sources: prev.sources.filter(s => s.id !== id),
      releases: prev.releases.filter(r => r.sourceId !== id) // Remove releases for that source
    }));
  }, []);

  const refreshAll = useCallback(async () => {
    setPage(1);
    const promises = state.sources.map(s => fetchReleases(s.owner, s.repo, 1));
    const results = await Promise.all(promises);
    const allReleases = results.flat();

    setState(prev => ({
      ...prev,
      releases: allReleases.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      ),
      lastUpdated: new Date().toISOString()
    }));
  }, [state.sources]);

  const loadMore = useCallback(async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    
    try {
      const promises = state.sources.map(s => fetchReleases(s.owner, s.repo, nextPage));
      const results = await Promise.all(promises);
      const newReleases = results.flat();
      
      if (newReleases.length > 0) {
        setPage(nextPage);
        setState(prev => {
          // Filter out duplicates based on id
          const existingIds = new Set(prev.releases.map(r => r.id));
          const uniqueNewReleases = newReleases.filter(r => !existingIds.has(r.id));
          
          return {
            ...prev,
            releases: [...prev.releases, ...uniqueNewReleases].sort((a, b) => 
              new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
            )
          };
        });
      }
    } finally {
      setLoadingMore(false);
    }
  }, [state.sources, page, loadingMore]);

  return {
    sources: state.sources,
    releases: state.releases,
    addSource,
    removeSource,
    refreshAll,
    loadMore,
    loadingMore
  };
};
