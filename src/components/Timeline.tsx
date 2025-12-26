import type { Release } from '../types';
import { ReleaseCard } from './ReleaseCard';

interface TimelineProps {
  releases: Release[];
  refresh: () => void;
}

export function Timeline({ releases, refresh }: TimelineProps) {
  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>Latest Releases</h2>
        <button onClick={refresh} className="btn" style={{ fontSize: '0.85rem' }}>Refresh</button>
      </div>
      
      {releases.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--secondary-color)' }}>
          <p>No releases found. Go to Sources to add your favorite repositories.</p>
        </div>
      ) : (
        releases.map(release => (
          <ReleaseCard key={`${release.sourceId}-${release.id}`} release={release} />
        ))
      )}
    </div>
  );
}
