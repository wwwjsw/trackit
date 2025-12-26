import type { Release } from '../types';
import { ReleaseCard } from './ReleaseCard';

interface TimelineProps {
  releases: Release[];
  refresh: () => void;
  loadMore?: () => void;
  loadingMore?: boolean;
}

export function Timeline({ releases, refresh, loadMore, loadingMore }: TimelineProps) {
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
        <>
          {Object.entries(groupReleasesByDate(releases)).map(([date, dateReleases]) => (
            <div key={date}>
              <h3 style={{ 
                fontSize: '0.9rem', 
                color: 'var(--secondary-color)', 
                margin: '1.5rem 0 0.5rem',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '0.5rem'
              }}>
                {date}
              </h3>
              {dateReleases.map(release => (
                <ReleaseCard key={`${release.sourceId}-${release.id}`} release={release} />
              ))}
            </div>
          ))}
          
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button 
              onClick={loadMore} 
              className="btn"
              disabled={loadingMore}
              style={{ width: '100%', padding: '0.8rem' }}
            >
              {loadingMore ? 'Loading...' : 'Load More Releases'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function groupReleasesByDate(releases: Release[]) {
  const groups: Record<string, Release[]> = {};
  
  releases.forEach(release => {
    const date = new Date(release.publishedAt);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    let dateStr = date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    if (date.toDateString() === today.toDateString()) {
      dateStr = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateStr = 'Yesterday';
    }
    
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(release);
  });
  
  return groups;
}
