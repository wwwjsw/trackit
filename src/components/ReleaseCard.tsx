import type { Release } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ReleaseCardProps {
  release: Release;
}

export function ReleaseCard({ release }: ReleaseCardProps) {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem', borderRadius: '12px', borderLeft: '4px solid var(--accent-color)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem' }}>
            <span style={{ color: 'var(--secondary-color)', fontWeight: 'normal', fontSize: '0.9em' }}>{release.sourceId.split('/')[1]} </span>
            {release.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--secondary-color)' }}>
            <Tag size={14} />
            <span>{release.tagName}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(release.publishedAt), { addSuffix: true })}</span>
          </div>
        </div>
        <a 
          href={release.htmlUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn"
          style={{ padding: '0.4rem', lineHeight: 0 }}
        >
          <ExternalLink size={18} />
        </a>
      </div>
      
      {/* Basic body truncation or rendering */}
      <div className="markdown-body" style={{ fontSize: '0.95rem', color: 'var(--text-color)', opacity: 0.9, marginTop: '1rem' }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{release.body}</ReactMarkdown>
      </div>
    </div>
  );
}
